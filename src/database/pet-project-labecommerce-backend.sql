-- Active: 1674868682256@@127.0.0.1@3306
CREATE TABLE clients (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    create_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT
);

 INSERT INTO clients (id, name, email, password)
    VALUES ("u001", "Natalia","natalia@email.com", "123456"),
    ("u002", "Joao","joao@email.com", "147258"),
    ("u003","Marcela", "Marcela@email.com", "123456");

 INSERT INTO products (id, name, price, description )
    VALUES 
    ("p001", "Camiseta", 20.75, "Roupas e Calçados"), 
    ("p002", "Tenis de Corrida", 20.7, "Roupas e Calçados"),
    ("p003", "Monitor", 99.99, "Eletrônicos"),
    ("p004","Garrafa Térmica", 25,"Acessórios"),
    ("p005", "Mouse", 700.20,"Eletrônicos"), 
    ("p006", "Calça", 120.35, "Roupas e Calçados"),
    ("p007", "HD", 480.90, "Eletrônicos"),
    ("p008","Mochila", 275,"Acessórios"),
    ("p009", "Cafeteira", 100,"Eletrônicos");

SELECT * FROM clients;

SELECT * FROM products;

DELETE FROM clients;

SELECT * FROM products
WHERE name="Monitor";

SELECT * FROM products 
WHERE id="p001";

DELETE from products
WHERE id="p001";

DELETE from clients
WHERE id="u001";

UPDATE clients
SET email="gerente@email.com"
WHERE id="u001";

UPDATE products
SET name="Monitor"
WHERE id="p001";

SELECT * FROM clients
ORDER BY email ASC;

SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

SELECT * FROM products
WHERE price >=100 AND price <=300;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    create_at TEXT DEFAULT (DATETIME()) NOT NULL,
    delivered_at TEXT,  
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES clients (id)
);

INSERT INTO purchases (id, total_price, paid, delivered_at, buyer_id) 
VALUES ("pu001", 100, 1,NULL,"u001"),
("pu002", 500, 0,NULL,"u001"),
("pu003", 80, 0,NULL,"u002"),
("pu004", 250, 0,NULL,"u003");

SELECT * from purchases;

UPDATE purchases
SET delivered_at = datetime('now')
WHERE id="pu001";

SELECT 
clients.id AS clientID,
clients.email,
clients.password,
purchases.*
FROM clients
INNER JOIN purchases
ON purchases.buyer_id = clients.id;

CREATE TABLE purchases_products
(purchase_id TEXT NOT NULL, 
product_id TEXT NOT NULL,
quantity INTEGER NOT NULL,
FOREIGN KEY (purchase_id) REFERENCES purchases(id),
FOREIGN KEY (product_id) REFERENCES products(id));

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES ("pu001","p001",6), 
("pu002","p008",2), 
("pu004","p009",1), 
("pu001","p002",6), 
("pu001","p003",6);

SELECT * FROM purchases_products;

SELECT 
purchases.id AS purchaseID,
products.id AS productId,
products.name AS productName,
purchases_products.quantity,
purchases.buyer_id,
purchases.total_price
FROM purchases_products
INNER JOIN purchases 
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;

SELECT *
FROM purchases
INNER JOIN clients
ON purchases