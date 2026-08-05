ALTER TABLE restaurants
  ADD COLUMN latitude double precision,
  ADD COLUMN longitude double precision,
  ADD COLUMN rating numeric(2, 1);
