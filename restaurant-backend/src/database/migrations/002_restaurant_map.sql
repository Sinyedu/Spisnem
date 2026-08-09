ALTER TABLE restaurants
  ADD COLUMN latitude double precision,
  ADD COLUMN longitude double precision,
  ADD COLUMN cuisine text,
  ADD COLUMN price_level smallint CHECK (price_level BETWEEN 1 AND 4),
  ADD COLUMN cover_image_url text;

CREATE INDEX restaurants_location_idx
  ON restaurants (longitude, latitude)
  WHERE is_active AND latitude IS NOT NULL AND longitude IS NOT NULL;
