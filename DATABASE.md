# Base de Datos - AhorraVotos

## Estado Actual

### Tablas Existentes

#### `categories`
| Columna | Tipo | Nullable |
|---------|------|----------|
| id | uuid | NO |
| name | text | NO |
| created_at | timestamp | YES |

#### `stores`
| Columna | Tipo | Nullable |
|---------|------|----------|
| id | uuid | NO |
| name | text | NO |
| created_at | timestamp | YES |

#### `subcategories`
| Columna | Tipo | Nullable |
|---------|------|----------|
| id | uuid | NO |
| name | text | NO |
| category_id | uuid | NO |
| created_at | timestamp | YES |

#### `products`
| Columna | Tipo | Nullable |
|---------|------|----------|
| id | uuid | NO |
| name | text | NO |
| description | text | YES |
| price | numeric | NO |
| image_url | text | YES |
| store_id | uuid | NO |
| category_id | uuid | NO |
| subcategory_id | uuid | YES |
| **votes** | integer | YES |
| created_at | timestamp | YES |

#### `votes` (Sistema actual - ANÓNIMO)
| Columna | Tipo | Nullable |
|---------|------|----------|
| id | uuid | NO |
| product_id | uuid | NO |
| **voter_ip** | text | NO |
| created_at | timestamp | YES |

**Nota:** El sistema actual usa IP voter para tracking anónimo. No hay relación con usuarios autenticados.

---

## Cambios Requeridos - Fase 1

### 1. Modificar tabla `votes` (Migración suave)

```sql
-- Agregar columna para usuarios autenticados
ALTER TABLE votes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Crear índice para búsquedas por usuario
CREATE INDEX idx_votes_user ON votes(user_id);

-- Actualizar políticas RLS para permitir ambos sistemas
DROP POLICY IF EXISTS "Public read" ON votes;
CREATE POLICY "Public read" ON votes FOR SELECT USING (true);

CREATE POLICY "Anonymous can vote by IP" ON votes
  FOR INSERT WITH CHECK (voter_ip IS NOT NULL AND user_id IS NULL);

CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User can delete own vote" ON votes
  FOR DELETE USING (auth.uid() = user_id);

-- Constraint: Un voto por producto (ya sea por IP o por usuario)
-- Nota: Esto requiere una función personalizada para validar
```

### 2. Crear tabla `comments`

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can modify own comments" ON comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can comment" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_comments_product ON comments(product_id);
CREATE INDEX idx_comments_user ON comments(user_id);
```

### 3. Agregar contador de comentarios a `products`

```sql
ALTER TABLE products ADD COLUMN comments_count INTEGER DEFAULT 0;
```

### 4. Opcional: Crear tabla `profiles` para datos extra de usuario

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can modify own profile" ON profiles
  FOR ALL USING (auth.uid() = id);
```

---

## Relaciones (Foreign Keys)

```
products.store_id → stores.id
products.category_id → categories.id
products.subcategory_id → subcategories.id
subcategories.category_id → categories.id
votes.product_id → products.id
votes.user_id → auth.users(id) [NUEVO]
comments.product_id → products.id
comments.user_id → auth.users(id)
profiles.id → auth.users(id) [OPCIONAL]
```

---

## Consideraciones de Migración

### Sistema Híbrido (Transición)

Durante la migración, ambos sistemas coexistirán:

| Usuario | Sistema |
|---------|---------|
| No autenticado | Vota con `voter_ip` (sistema actual) |
| Autenticado | Vota con `user_id` (nuevo sistema) |

### Validación de Unicidad

Para evitar votos duplicados, crear una función:

```sql
CREATE OR REPLACE FUNCTION check_unique_vote()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe voto para este producto (por IP o usuario)
  IF EXISTS (
    SELECT 1 FROM votes
    WHERE product_id = NEW.product_id
    AND (voter_ip = NEW.voter_ip OR user_id = NEW.user_id)
  ) THEN
    RAISE EXCEPTION 'Ya has votado por este producto';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER unique_vote_trigger
  BEFORE INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION check_unique_vote();
```

### Contador de votos en tiempo real

En lugar de mantener `products.votes`, usar una vista materializada o cálculo en tiempo real:

```sql
-- Vista para contar votos por producto
CREATE VIEW product_votes_count AS
SELECT
  product_id,
  COUNT(*) as vote_count
FROM votes
GROUP BY product_id;

-- O actualizar el contador con triggers
CREATE OR REPLACE FUNCTION update_product_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET votes = (SELECT COUNT(*) FROM votes WHERE product_id = COALESCE(NEW.product_id, OLD.product_id))
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_votes_after_insert
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_product_vote_count();

CREATE TRIGGER update_votes_after_delete
  AFTER DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_product_vote_count();
```
