-- Insertar tiendas
INSERT INTO stores (name) VALUES
  ('D1'),
  ('Ara'),
  ('Dollarcity'),
  ('Justo y Bueno'),
  ('Tiendas 3B')
ON CONFLICT DO NOTHING;

-- Insertar categorías
INSERT INTO categories (name) VALUES
  ('Alimentos'),
  ('Limpieza'),
  ('Hogar'),
  ('Cuidado Personal'),
  ('Mascotas')
ON CONFLICT DO NOTHING;

-- Insertar subcategorías
INSERT INTO subcategories (name, category_id)
SELECT 'Snacks', id FROM categories WHERE name = 'Alimentos'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Bebidas', id FROM categories WHERE name = 'Alimentos'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Lacteos', id FROM categories WHERE name = 'Alimentos'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Enlatados', id FROM categories WHERE name = 'Alimentos'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Detergentes', id FROM categories WHERE name = 'Limpieza'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Desinfectantes', id FROM categories WHERE name = 'Limpieza'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Esponjas', id FROM categories WHERE name = 'Limpieza'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Cocina', id FROM categories WHERE name = 'Hogar'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Organizacion', id FROM categories WHERE name = 'Hogar'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Higiene', id FROM categories WHERE name = 'Cuidado Personal'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Belleza', id FROM categories WHERE name = 'Cuidado Personal'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Alimento Mascotas', id FROM categories WHERE name = 'Mascotas'
ON CONFLICT DO NOTHING;

INSERT INTO subcategories (name, category_id)
SELECT 'Accesorios Mascotas', id FROM categories WHERE name = 'Mascotas'
ON CONFLICT DO NOTHING;

-- Insertar productos
INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Papas Margarita Limon',
  'Deliciosas papas fritas sabor limon, perfectas para snacks. Paquete de 25g ideal para loncheras.',
  1500,
  (SELECT id FROM stores WHERE name = 'D1'),
  (SELECT id FROM categories WHERE name = 'Alimentos'),
  (SELECT id FROM subcategories WHERE name = 'Snacks'),
  42
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Gaseosa Cola 2L',
  'Refrescante bebida gaseosa sabor cola. Ideal para compartir en familia.',
  3200,
  (SELECT id FROM stores WHERE name = 'Ara'),
  (SELECT id FROM categories WHERE name = 'Alimentos'),
  (SELECT id FROM subcategories WHERE name = 'Bebidas'),
  38
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Detergente Liquido 1L',
  'Detergente concentrado para ropa. Rinde hasta 20 lavadas y deja tu ropa impecable.',
  8500,
  (SELECT id FROM stores WHERE name = 'D1'),
  (SELECT id FROM categories WHERE name = 'Limpieza'),
  (SELECT id FROM subcategories WHERE name = 'Detergentes'),
  67
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Organizador de Cocina',
  'Organizador plastico multiusos con 3 niveles. Ideal para especias y condimentos.',
  12000,
  (SELECT id FROM stores WHERE name = 'Dollarcity'),
  (SELECT id FROM categories WHERE name = 'Hogar'),
  (SELECT id FROM subcategories WHERE name = 'Organizacion'),
  23
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Jabon Antibacterial 3-Pack',
  'Pack de 3 jabones antibacteriales de 90g cada uno. Proteccion para toda la familia.',
  4500,
  (SELECT id FROM stores WHERE name = 'Ara'),
  (SELECT id FROM categories WHERE name = 'Cuidado Personal'),
  (SELECT id FROM subcategories WHERE name = 'Higiene'),
  55
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Leche Entera 1L',
  'Leche entera pasteurizada de alta calidad. Rica en calcio y vitaminas.',
  2800,
  (SELECT id FROM stores WHERE name = 'Justo y Bueno'),
  (SELECT id FROM categories WHERE name = 'Alimentos'),
  (SELECT id FROM subcategories WHERE name = 'Lacteos'),
  89
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Alimento para Perro 2kg',
  'Alimento balanceado para perros adultos. Rico en proteinas y nutrientes esenciales.',
  18500,
  (SELECT id FROM stores WHERE name = 'D1'),
  (SELECT id FROM categories WHERE name = 'Mascotas'),
  (SELECT id FROM subcategories WHERE name = 'Alimento Mascotas'),
  31
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Desinfectante Multiusos 500ml',
  'Desinfectante en spray que elimina el 99.9% de bacterias. Aroma lavanda.',
  6200,
  (SELECT id FROM stores WHERE name = 'Tiendas 3B'),
  (SELECT id FROM categories WHERE name = 'Limpieza'),
  (SELECT id FROM subcategories WHERE name = 'Desinfectantes'),
  44
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Set de Esponjas x5',
  'Set de 5 esponjas doble uso para cocina. Lado suave y lado abrasivo.',
  3500,
  (SELECT id FROM stores WHERE name = 'Dollarcity'),
  (SELECT id FROM categories WHERE name = 'Limpieza'),
  (SELECT id FROM subcategories WHERE name = 'Esponjas'),
  28
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Atun en Lata 170g',
  'Atun en aceite de alta calidad. Ideal para ensaladas, sandwiches y recetas.',
  4200,
  (SELECT id FROM stores WHERE name = 'Ara'),
  (SELECT id FROM categories WHERE name = 'Alimentos'),
  (SELECT id FROM subcategories WHERE name = 'Enlatados'),
  72
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Shampoo Anticaspa 400ml',
  'Shampoo especial para combatir la caspa. Con mentol refrescante.',
  9800,
  (SELECT id FROM stores WHERE name = 'Justo y Bueno'),
  (SELECT id FROM categories WHERE name = 'Cuidado Personal'),
  (SELECT id FROM subcategories WHERE name = 'Higiene'),
  36
);

INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes)
VALUES (
  'Sarten Antiadherente 24cm',
  'Sarten con recubrimiento antiadherente. Mango ergonomico resistente al calor.',
  15000,
  (SELECT id FROM stores WHERE name = 'Dollarcity'),
  (SELECT id FROM categories WHERE name = 'Hogar'),
  (SELECT id FROM subcategories WHERE name = 'Cocina'),
  19
);
