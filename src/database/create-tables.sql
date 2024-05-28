CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE cart_status as ENUM('OPEN', 'ORDERED');

DROP TABLE IF EXISTS "cart_items";
DROP TABLE IF EXISTS "carts";

CREATE TABLE IF NOT EXISTS "carts" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now(),
	updated_at TIMESTAMP NOT NULL DEFAULT now(),
	status cart_status DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS "cart_items" (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	cart_id UUID,
	product_id UUID,
	count INTEGER,
	FOREIGN KEY (cart_id) REFERENCES "carts" ("id") ON DELETE CASCADE
);