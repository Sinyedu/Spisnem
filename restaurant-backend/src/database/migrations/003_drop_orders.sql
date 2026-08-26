-- Spisnem is a queue product; ordering was never built out and is being removed.
-- order_items references orders, so it goes first. Indexes drop with their tables.
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
