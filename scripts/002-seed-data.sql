-- Insertar tiendas
INSERT INTO stores (name, slug) VALUES
('D1', 'd1'),
('Ara', 'ara'),
('Dollarcity', 'dollarcity'),
('Justo y Bueno', 'justo-y-bueno'),
('Isidroshop', 'isidroshop');

-- Insertar categorías
INSERT INTO categories (name, slug) VALUES
('Alimentos', 'alimentos'),
('Hogar', 'hogar'),
('Cuidado Personal', 'cuidado-personal'),
('Limpieza', 'limpieza'),
('Tecnología', 'tecnologia');

-- Insertar subcategorías
INSERT INTO subcategories (name, slug, category_id) VALUES
-- Alimentos
('Snacks', 'snacks', (SELECT id FROM categories WHERE slug = 'alimentos')),
('Bebidas', 'bebidas', (SELECT id FROM categories WHERE slug = 'alimentos')),
('Lácteos', 'lacteos', (SELECT id FROM categories WHERE slug = 'alimentos')),
('Enlatados', 'enlatados', (SELECT id FROM categories WHERE slug = 'alimentos')),
-- Hogar
('Decoración', 'decoracion', (SELECT id FROM categories WHERE slug = 'hogar')),
('Cocina', 'cocina', (SELECT id FROM categories WHERE slug = 'hogar')),
('Organización', 'organizacion', (SELECT id FROM categories WHERE slug = 'hogar')),
-- Cuidado Personal
('Higiene', 'higiene', (SELECT id FROM categories WHERE slug = 'cuidado-personal')),
('Belleza', 'belleza', (SELECT id FROM categories WHERE slug = 'cuidado-personal')),
-- Limpieza
('Detergentes', 'detergentes', (SELECT id FROM categories WHERE slug = 'limpieza')),
('Desinfectantes', 'desinfectantes', (SELECT id FROM categories WHERE slug = 'limpieza')),
-- Tecnología
('Accesorios', 'accesorios', (SELECT id FROM categories WHERE slug = 'tecnologia')),
('Audio', 'audio', (SELECT id FROM categories WHERE slug = 'tecnologia'));

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price, store_id, category_id, subcategory_id, votes) VALUES
-- D1
('Papas Margarita x3', 'Pack de 3 paquetes de papas margarita sabor natural, perfectas para compartir', 5900, 
  (SELECT id FROM stores WHERE slug = 'd1'),
  (SELECT id FROM categories WHERE slug = 'alimentos'),
  (SELECT id FROM subcategories WHERE slug = 'snacks'), 127),
  
('Leche Entera 1L', 'Leche entera pasteurizada, ideal para toda la familia', 3200,
  (SELECT id FROM stores WHERE slug = 'd1'),
  (SELECT id FROM categories WHERE slug = 'alimentos'),
  (SELECT id FROM subcategories WHERE slug = 'lacteos'), 89),

('Detergente Líquido 2L', 'Detergente concentrado para ropa, rinde hasta 40 lavadas', 12900,
  (SELECT id FROM stores WHERE slug = 'd1'),
  (SELECT id FROM categories WHERE slug = 'limpieza'),
  (SELECT id FROM subcategories WHERE slug = 'detergentes'), 156),

-- Ara
('Galletas Surtidas 400g', 'Galletas surtidas con diferentes sabores y texturas', 4500,
  (SELECT id FROM stores WHERE slug = 'ara'),
  (SELECT id FROM categories WHERE slug = 'alimentos'),
  (SELECT id FROM subcategories WHERE slug = 'snacks'), 203),

('Shampoo Anticaspa 400ml', 'Shampoo especializado para control de caspa con zinc', 8900,
  (SELECT id FROM stores WHERE slug = 'ara'),
  (SELECT id FROM categories WHERE slug = 'cuidado-personal'),
  (SELECT id FROM subcategories WHERE slug = 'higiene'), 67),

('Set Organizadores x5', 'Set de 5 cajas organizadoras de diferentes tamaños', 15900,
  (SELECT id FROM stores WHERE slug = 'ara'),
  (SELECT id FROM categories WHERE slug = 'hogar'),
  (SELECT id FROM subcategories WHERE slug = 'organizacion'), 94),

-- Dollarcity
('Cable USB-C 2m', 'Cable de carga rápida USB-C, compatible con la mayoría de dispositivos', 7900,
  (SELECT id FROM stores WHERE slug = 'dollarcity'),
  (SELECT id FROM categories WHERE slug = 'tecnologia'),
  (SELECT id FROM subcategories WHERE slug = 'accesorios'), 312),

('Audífonos Bluetooth', 'Audífonos inalámbricos con hasta 4 horas de batería', 19900,
  (SELECT id FROM stores WHERE slug = 'dollarcity'),
  (SELECT id FROM categories WHERE slug = 'tecnologia'),
  (SELECT id FROM subcategories WHERE slug = 'audio'), 245),

('Set Decoración Navidad', 'Kit completo de decoración navideña para el hogar', 24900,
  (SELECT id FROM stores WHERE slug = 'dollarcity'),
  (SELECT id FROM categories WHERE slug = 'hogar'),
  (SELECT id FROM subcategories WHERE slug = 'decoracion'), 178),

-- Justo y Bueno
('Atún en Aceite x3', 'Pack de 3 latas de atún en aceite vegetal', 9900,
  (SELECT id FROM stores WHERE slug = 'justo-y-bueno'),
  (SELECT id FROM categories WHERE slug = 'alimentos'),
  (SELECT id FROM subcategories WHERE slug = 'enlatados'), 134),

('Jabón Líquido Manos 500ml', 'Jabón antibacterial con aloe vera', 5500,
  (SELECT id FROM stores WHERE slug = 'justo-y-bueno'),
  (SELECT id FROM categories WHERE slug = 'cuidado-personal'),
  (SELECT id FROM subcategories WHERE slug = 'higiene'), 88),

('Desinfectante Multiusos 1L', 'Desinfectante con aroma lavanda, elimina 99.9% de bacterias', 6900,
  (SELECT id FROM stores WHERE slug = 'justo-y-bueno'),
  (SELECT id FROM categories WHERE slug = 'limpieza'),
  (SELECT id FROM subcategories WHERE slug = 'desinfectantes'), 201),

-- Isidroshop
('Gaseosa Cola 3L', 'Bebida gaseosa sabor cola, tamaño familiar', 4900,
  (SELECT id FROM stores WHERE slug = 'isidroshop'),
  (SELECT id FROM categories WHERE slug = 'alimentos'),
  (SELECT id FROM subcategories WHERE slug = 'bebidas'), 156),

('Set Utensilios Cocina x6', 'Juego de 6 utensilios de cocina en nylon resistente al calor', 18900,
  (SELECT id FROM stores WHERE slug = 'isidroshop'),
  (SELECT id FROM categories WHERE slug = 'hogar'),
  (SELECT id FROM subcategories WHERE slug = 'cocina'), 112),

('Crema Hidratante 200ml', 'Crema corporal hidratante con vitamina E', 7900,
  (SELECT id FROM stores WHERE slug = 'isidroshop'),
  (SELECT id FROM categories WHERE slug = 'cuidado-personal'),
  (SELECT id FROM subcategories WHERE slug = 'belleza'), 79);
