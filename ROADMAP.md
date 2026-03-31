# Roadmap - AhorraVotos

## Visión General
Plataforma de votación de productos para tiendas de bajo costo (D1, Ara, Dollarcity, etc.) donde la comunidad descubre y valora los mejores productos.

---

## Fase 1: Comentarios y Autenticación Google

### Objetivo
Agregar capa de seguridad y socialización mediante autenticación con Google y comentarios opcionales en los votos.

### Cambios en Base de Datos

#### Nueva tabla: `comments`
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Política:任何人 puede leer comentarios
CREATE POLICY "Public read" ON comments FOR SELECT USING (true);

-- Política: Solo el autor puede editar/borrar sus comentarios
CREATE POLICY "User can modify own comments" ON comments
  FOR ALL USING (auth.uid() = user_id);
```

#### Modificar tabla: `products`
```sql
-- Agregar contador de comentarios
ALTER TABLE products ADD COLUMN comments_count INTEGER DEFAULT 0;

-- Crear índice para búsquedas
CREATE INDEX idx_products_votes ON products(votes DESC);
CREATE INDEX idx_comments_product ON comments(product_id);
```

#### Modificar tabla: `votes` (Nueva)
```sql
-- Reemplazar el sistema actual de votos localStorage por una tabla
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id) -- Un voto por usuario por producto
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON votes FOR SELECT USING (true);
CREATE POLICY "User can see own votes" ON votes FOR SELECT USING (auth.uid() = user_id);
```

### Autenticación con Google

#### Configuración en Supabase
1. Dashboard → Authentication → Providers → Google
2. Habilitar Google Provider
3. Configurar OAuth Callback URL
4. Agregar Client ID y Secret de Google Cloud Console

#### Implementación en Next.js

**Nuevos archivos a crear:**
```
app/
  auth/
    login/route.ts          # Página de login
    callback/route.ts       # Callback de Google
    logout/route.ts         # Cerrar sesión
  middleware.ts             # Protección de rutas

lib/
  supabase/
    middleware.ts           # Helper de auth para middleware

hooks/
  use-user.ts              # Hook para obtener usuario actual
```

**Flujo de autenticación:**
- Usuario hace clic en "Iniciar con Google"
- Redirigido a Google OAuth
- Callback crea/actualiza usuario en `auth.users` de Supabase
- Session guardada en cookies
- Redirigido a la app con sesión activa

### UI/UX: Comentarios

**Componente `product-card.tsx`**
- Mostrar contador de comentarios
- Al votar, mostrar modal/expandible para agregar comentario (opcional)
- Icono de bubble chat con contador

**Nuevo componente `comments-section.tsx`**
- Lista de comentarios del producto
- Input para agregar nuevo comentario
- Avatar del usuario + nombre
- Timestamp relativo ("hace 5 min")

**Nuevo componente `auth-button.tsx`**
- Botón "Iniciar con Google" si no autenticado
- Avatar del usuario + menú si autenticado
- Opción de cerrar sesión

---

## Fase 2: Proveedores Adicionales (Posterior)

### Objetivo
Expandir opciones de autenticación para reducir fricción.

### Proveedores a agregar
- Email/Password tradicional
- Facebook Login
- X (Twitter) Login

### Configuración Supabase
- Habilitar providers adicionales en Authentication → Providers
- Configurar cada OAuth app

---

## Prioridades Técnicas

### Seguridad
- [ ] Configurar RLS correctamente en todas las tablas
- [ ] Validar que solo usuarios autenticados puedan votar
- [ ] Prevenir votos duplicados (constraint UNIQUE en BD)
- [ ] Sanitizar input de comentarios para prevenir XSS

### Performance
- [ ] Implementar cache de comentarios con SWR
- [ ] Paginar comentarios (máx 20 por producto inicialmente)
- [ ] Optimizar consultas con índices

### UX
- [ ] Loading states durante autenticación
- [ ] Manejo de errores claros
- [ ] Persistencia de sesión con refresh tokens

---

## Dependencias

### Paquetes a agregar
```json
{
  "@supabase/ssr": "ya instalado",
  "next-themes": "ya instalado",
  "react-google-button": "opcional, o crear custom"
}
```

---

## Notas de Implementación

- Supabase Auth maneja automáticamente los usuarios y sesiones
- `auth.users` es la tabla interna de Supabase, no crear tabla `users`
- Los perfiles adicionales (nombre, avatar) se almacenan en `user_metadata`
- Para datos extra del usuario, crear tabla `profiles` con relación a `auth.users`
