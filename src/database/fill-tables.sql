INSERT INTO carts (user_id) VALUES
	('e48d318c-6f02-45b2-841e-2b1f8c19d6be');

CREATE OR REPLACE FUNCTION fetch_order_id()
	RETURNS UUID
	LANGUAGE plpgsql
AS
$$
DECLARE
	new_cart_id UUID;
BEGIN
	SELECT id INTO new_cart_id FROM carts ORDER BY created_at ASC LIMIT 1;

	RETURN new_cart_id;
END;
$$;

INSERT INTO cart_items (cart_id, product_id, count) VALUES
	(fetch_order_id(), 'a1749a4b-15bb-47d1-94d4-4ebf6b7612a7', 1),
	(fetch_order_id(), '39e6fba2-09a2-4d92-8e0d-5243d6e6e291', 2);

SELECT * FROM carts as ca JOIN cart_items as ci ON ca.id = ci.cart_id;
