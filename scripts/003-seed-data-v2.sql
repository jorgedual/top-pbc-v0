-- Insertar tiendas
INSERT INTO stores (name) VALUES
  ('D1'),
  ('Ara'),
  ('Dollarcity'),
  ('Justo & Bueno'),
  ('Tiendas 3B');

-- Insertar categorías
INSERT INTO categories (name) VALUES
  ('Alimentos'),
  ('Limpieza'),
  ('Hogar'),
  ('Cuidado Personal'),
  ('Mascotas');

-- Insertar subcategorías para Alimentos
INSERT INTO subcategories (name, category_id)
SELECT name, c.id FROM (
  VALUES 
    ('Snacks'),
    ('Bebidas'),
    ('Lácteos'),
    ('Enlatados'),
    ('Panadería')
) AS s(name)
CROSS JOIN categories c WHERE c.name = 'Alimentos';

-- Insertar subcategorías para Limpieza
INSERT INTO subcategories (name, category_id)
SELECT name, c.id FROM (
  VALUES 
    ('Detergentes'),
    ('Desinfectantes'),
    ('Limpiadores'),
    ('Esponjas y Trapos')
) AS s(name)
CROSS JOIN categories c WHERE c.name = 'Limpieza';

-- Insertar subcategorías para Hogar
INSERT INTO subcategories (name, category_id)
SELECT name, c.id FROM (
  VALUES 
    ('Cocina'),
    ('Organización'),
    ('Decoración'),
    ('Herramientas')
) AS s(name)
CROSS JOIN categories c WHERE c.name = 'Hogar';

-- Insertar subcategorías para Cuidado Personal
INSERT INTO subcategories (name, category_id)
SELECT name, c.id FROM (
  VALUES 
    ('Higiene'),
    ('Belleza'),
    ('Salud')
) AS s(name)
CROSS JOIN categories c WHERE c.name = 'Cuidado Personal';

-- Insertar subcategorías para Mascotas
INSERT INTO subcategories (name, category_id)
SELECT name, c.id FROM (
  VALUES 
    ('Alimento para Mascotas'),
    ('Accesorios'),
    ('Higiene Mascotas')
) AS s(name)
CROSS JOIN categories c WHERE c.name = 'Mascotas';

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Papas Margarita Limón',
  'Deliciosas papas fritas sabor limón, perfectas para snacks. Paquete de 25g ideal para loncheras.',
  1500,
  s.id,
  c.id,
  sc.id,
  42
FROM stores s, categories c, subcategories sc
WHERE s.name = 'D1' AND c.name = 'Alimentos' AND sc.name = 'Snacks' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Gaseosa Cola 2L',
  'Refrescante bebida gaseosa sabor cola. Ideal para compartir en familia.',
  3200,
  s.id,
  c.id,
  sc.id,
  38
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Ara' AND c.name = 'Alimentos' AND sc.name = 'Bebidas' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Detergente Líquido 1L',
  'Detergente concentrado para ropa. Rinde hasta 20 lavadas y deja tu ropa impecable.',
  8500,
  s.id,
  c.id,
  sc.id,
  67
FROM stores s, categories c, subcategories sc
WHERE s.name = 'D1' AND c.name = 'Limpieza' AND sc.name = 'Detergentes' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Organizador de Cocina',
  'Organizador plástico multiusos con 3 niveles. Ideal para especias y condimentos.',
  12000,
  s.id,
  c.id,
  sc.id,
  23
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Dollarcity' AND c.name = 'Hogar' AND sc.name = 'Organización' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Jabón Antibacterial 3-Pack',
  'Pack de 3 jabones antibacteriales de 90g cada uno. Protección para toda la familia.',
  4500,
  s.id,
  c.id,
  sc.id,
  55
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Ara' AND c.name = 'Cuidado Personal' AND sc.name = 'Higiene' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Leche Entera 1L',
  'Leche entera pasteurizada de alta calidad. Rica en calcio y vitaminas.',
  2800,
  s.id,
  c.id,
  sc.id,
  89
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Justo & Bueno' AND c.name = 'Alimentos' AND sc.name = 'Lácteos' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Alimento para Perro 2kg',
  'Alimento balanceado para perros adultos. Rico en proteínas y nutrientes esenciales.',
  18500,
  s.id,
  c.id,
  sc.id,
  31
FROM stores s, categories c, subcategories sc
WHERE s.name = 'D1' AND c.name = 'Mascotas' AND sc.name = 'Alimento para Mascotas' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Desinfectante Multiusos 500ml',
  'Desinfectante en spray que elimina el 99.9% de bacterias. Aroma lavanda.',
  6200,
  s.id,
  c.id,
  sc.id,
  44
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Tiendas 3B' AND c.name = 'Limpieza' AND sc.name = 'Desinfectantes' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Set de Esponjas x5',
  'Set de 5 esponjas doble uso para cocina. Lado suave y lado abrasivo.',
  3500,
  s.id,
  c.id,
  sc.id,
  28
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Dollarcity' AND c.name = 'Limpieza' AND sc.name = 'Esponjas y Trapos' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Atún en Lata 170g',
  'Atún en aceite de alta calidad. Ideal para ensaladas, sandwiches y recetas.',
  4200,
  s.id,
  c.id,
  sc.id,
  72
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Ara' AND c.name = 'Alimentos' AND sc.name = 'Enlatados' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Shampoo Anticaspa 400ml',
  'Shampoo especial para combatir la caspa. Con mentol refrescante.',
  9800,
  s.id,
  c.id,
  sc.id,
  36
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Justo & Bueno' AND c.name = 'Cuidado Personal' AND sc.name = 'Higiene' AND sc.category_id = c.id;

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
SELECT 
  'Sartén Antiadherente 24cm',
  'Sartén con recubrimiento antiadherente. Mango ergonómico resistente al calor.',
  15000,
  s.id,
  c.id,
  sc.id,
  19
FROM stores s, categories c, subcategories sc
WHERE s.name = 'Dollarcity' AND c.name = 'Hogar' AND sc.name = 'Cocina' AND sc.category_id = c.id;
