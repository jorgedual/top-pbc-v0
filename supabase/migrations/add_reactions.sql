-- ============================================
-- Sistema de Reacciones - AhorraVotos
-- ============================================

-- 1. Crear enum para tipos de reacción
CREATE TYPE reaction_type AS ENUM ('like', 'love', 'neutral', 'angry');

-- 2. Crear tabla de reacciones
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Un usuario solo puede tener una reacción por producto
  UNIQUE(product_id, user_id)
);

-- 3. Crear índices para rendimiento
CREATE INDEX idx_reactions_product_id ON reactions(product_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view all reactions"
  ON reactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert their own reactions"
  ON reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions"
  ON reactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Función para calcular el score ponderado de reacciones
-- Pesos: like=2, love=3, neutral=1, angry=0
CREATE OR REPLACE FUNCTION calculate_reaction_score(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  like_count INTEGER;
  love_count INTEGER;
  angry_count INTEGER;
  neutral_count INTEGER;
  score INTEGER;
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE reaction_type = 'like') INTO like_count
  FROM reactions
  WHERE product_id = product_uuid;

  SELECT
    COUNT(*) FILTER (WHERE reaction_type = 'love') INTO love_count
  FROM reactions
  WHERE product_id = product_uuid;

  SELECT
    COUNT(*) FILTER (WHERE reaction_type = 'angry') INTO angry_count
  FROM reactions
  WHERE product_id = product_uuid;

  SELECT
    COUNT(*) FILTER (WHERE reaction_type = 'neutral') INTO neutral_count
  FROM reactions
  WHERE product_id = product_uuid;

  score := (like_count * 2) + (love_count * 3) + (neutral_count * 1);

  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- 6. Agregar columna reaction_score a products
ALTER TABLE products ADD COLUMN IF NOT EXISTS reaction_score INTEGER DEFAULT 0;

-- 7. Crear trigger para actualizar reaction_score automáticamente
CREATE OR REPLACE FUNCTION update_product_reaction_score()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    UPDATE products
    SET reaction_score = calculate_reaction_score(NEW.product_id)
    WHERE id = NEW.product_id;

    -- Para DELETE, usar OLD
    IF TG_OP = 'DELETE' THEN
      UPDATE products
      SET reaction_score = calculate_reaction_score(OLD.product_id)
      WHERE id = OLD.product_id;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reaction_score
  AFTER INSERT OR UPDATE OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_product_reaction_score();

-- 8. Vista para obtener contadores de reacciones por producto
CREATE OR REPLACE VIEW product_reaction_counts AS
SELECT
  p.id as product_id,
  COUNT(*) FILTER (WHERE r.reaction_type = 'like') as like_count,
  COUNT(*) FILTER (WHERE r.reaction_type = 'love') as love_count,
  COUNT(*) FILTER (WHERE r.reaction_type = 'angry') as angry_count,
  COUNT(*) FILTER (WHERE r.reaction_type = 'neutral') as neutral_count,
  COUNT(*) as total_reactions
FROM products p
LEFT JOIN reactions r ON r.product_id = p.id
GROUP BY p.id;

-- 9. Función helper para obtener la reacción de un usuario en un producto
CREATE OR REPLACE FUNCTION get_user_reaction(product_uuid UUID, user_uuid UUID)
RETURNS reaction_type AS $$
DECLARE
  user_reaction reaction_type;
BEGIN
  SELECT reaction_type INTO user_reaction
  FROM reactions
  WHERE product_id = product_uuid AND user_id = user_uuid
  LIMIT 1;
  RETURN user_reaction;
END;
$$ LANGUAGE plpgsql;

-- 10. Inicializar reaction_score para productos existentes
UPDATE products
SET reaction_score = COALESCE(calculate_reaction_score(id), 0);

-- 11. Comentario para documentación
COMMENT ON TABLE reactions IS 'Almacena las reacciones de usuarios a productos (like, love, angry, neutral)';
COMMENT ON COLUMN reactions.reaction_type IS 'Tipo de reacción: like (👍), love (❤️), neutral (😐), angry (😡)';
COMMENT ON COLUMN products.reaction_score IS 'Score ponderado de reacciones: like=2, love=3, neutral=1, angry=0';
