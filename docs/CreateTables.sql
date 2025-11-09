CREATE TABLE subscribe (
  email VARCHAR(250) PRIMARY KEY
);

CREATE TYPE user_status AS ENUM ('admin','basic','standard','premium','user');

CREATE TABLE users (
  nick_name VARCHAR(100) PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,
  password VARCHAR(30) NOT NULL,
  created_at timestamp NOT NULL,
  telefon VARCHAR(30),
  user_status user_status NOT NULL DEFAULT 'user',
  avtar VARCHAR(50),
  mood JSONB,
  info JSONB,
  user_address JSONB,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  isPublic BOOLEAN DEFAULT true,
  isSubscribed BOOLEAN DEFAULT true
);

CREATE TABLE "recipes_categories" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" JSONB NOT NULL,
  "body" JSONB
);

CREATE TABLE recipes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES recipes_categories (id),
  name JSONB NOT NULL,
  body JSONB,
  created_at timestamp,
  aging INTEGER,
  isPublic BOOLEAN DEFAULT false
);

CREATE TYPE ingredients_type  AS ENUM ('Milk','Starter culture','Rennet', 'Salt', 'Spice', 'Additive', 'Coating', 'Concervant', 'Colorant', 'Enzyme', 'Other');

CREATE TABLE ingredients (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name JSONB,
  type ingredients_type NOT NULL DEFAULT 'Other',
  description JSONB,
  unit VARCHAR(10)
);

CREATE TABLE recipe_ingredients (
  recipe_id INTEGER REFERENCES recipes (id),
  ingredient_id INTEGER REFERENCES ingredients (id),
  amount integer,
  PRIMARY KEY (recipe_id, ingredient_id)
);

CREATE TABLE cheese_batches (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes (id),
  user_nick VARCHAR NOT NULL REFERENCES users (nick_name),
  date_batch timestamp,
  created_at DATE,
  ready_at DATE,
  description JSONB,
  foto VARCHAR(50),
  cheeseWeight DECIMAL(10,3),
  isPublic BOOLEAN DEFAULT false
);

CREATE TABLE milk_in_batch (
  batch_id INTEGER REFERENCES "cheese_batches" ("id"),
  milk_id INTEGER REFERENCES "ingredients" ("id"),
  amount INTEGER,
  PRIMARY KEY (batch_id, milk_id)
);

CREATE TABLE batch_notes (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  batche_id INTEGER NOT NULL REFERENCES cheese_batches (id),
  date timestamp,
  title JSONB NOT NULL,
  text JSONB
);

CREATE TABLE batch_coments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  batche_id INTEGER NOT NULL REFERENCES cheese_batches (id),
  user_nick VARCHAR NOT NULL REFERENCES users (nick_name),
  date timestamp,
  text JSONB NOT NULL
);

CREATE TABLE favorite_recipes (
  recipe_id INTEGER REFERENCES recipes (id),
  user_nick VARCHAR REFERENCES users (nick_name),
  PRIMARY KEY (recipe_id, user_nick)
);

CREATE TABLE products_categories (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name JSONB NOT NULL,
  body JSONB
);

CREATE TABLE products (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name JSONB NOT NULL,
  category_id INTEGER NOT NULL REFERENCES products_categories (id),
  description JSONB,
  price DECIMAL(10,2) NOT NULL,
  avaible BOOLEAN
);

CREATE TABLE cart_items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity INTEGER NOT NULL
);

CREATE TABLE cart (
  user_nick VARCHAR PRIMARY KEY REFERENCES users (nick_name),
  cart_items_id INTEGER NOT NULL REFERENCES cart_items (id),
  total_price DECIMAL(10,2)
);

CREATE TABLE order_items (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES "products" ("id"),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

CREATE TYPE order_status AS ENUM ('pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded');

CREATE TABLE orders (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_nick VARCHAR NOT NULL REFERENCES users (nick_name),
  order_items_id INTEGER NOT NULL REFERENCES order_items (id),
  date timestamp NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2),
  comment VARCHAR(500),
  shipp_address JSONB NOT NULL,
  status order_status NOT NULL DEFAULT 'pending'
);
