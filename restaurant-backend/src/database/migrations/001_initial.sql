CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  phone text,
  address text,
  city text,
  postal_code text,
  country_code text NOT NULL DEFAULT 'DK',
  hero_image_url text,
  queue_enabled boolean NOT NULL DEFAULT true,
  average_wait_minutes integer NOT NULL DEFAULT 10,
  currency text NOT NULL DEFAULT 'DKK',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE restaurant_users (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'staff')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, restaurant_id)
);

CREATE INDEX restaurant_users_restaurant_id_idx ON restaurant_users(restaurant_id);

CREATE TABLE queue_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  phone text,
  party_size integer NOT NULL CHECK (party_size BETWEEN 1 AND 20),
  notes text,
  status text NOT NULL DEFAULT 'waiting'
    CHECK (status IN ('waiting', 'notified', 'seated', 'cancelled', 'no_show')),
  public_token_hash text NOT NULL UNIQUE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz,
  seated_at timestamptz,
  cancelled_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX queue_entries_restaurant_status_idx
  ON queue_entries(restaurant_id, status, joined_at);

CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX menu_categories_restaurant_idx ON menu_categories(restaurant_id, sort_order);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price_minor integer NOT NULL CHECK (price_minor >= 0),
  currency text NOT NULL DEFAULT 'DKK',
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX menu_items_restaurant_idx ON menu_items(restaurant_id, sort_order);
CREATE INDEX menu_items_category_idx ON menu_items(category_id);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  queue_entry_id uuid REFERENCES queue_entries(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  public_token_hash text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('pay_at_restaurant', 'mock_card')),
  subtotal_minor integer NOT NULL,
  total_minor integer NOT NULL,
  currency text NOT NULL DEFAULT 'DKK',
  customer_notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  preparing_at timestamptz,
  ready_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_restaurant_status_idx ON orders(restaurant_id, status, submitted_at DESC);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name text NOT NULL,
  unit_price_minor integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  line_total_minor integer NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_idx ON order_items(order_id);
