import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, stock INTEGER);
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, email TEXT, country TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, total REAL, status TEXT);
CREATE TABLE order_items (item_id INTEGER PRIMARY KEY, order_id INTEGER, product_id INTEGER, quantity INTEGER, unit_price REAL);
`;

const dataSql = `
INSERT INTO products VALUES (1, 'Laptop', 'Electronics', 999.99, 50);
INSERT INTO products VALUES (2, 'Mouse', 'Electronics', 29.99, 200);
INSERT INTO products VALUES (3, 'Desk Chair', 'Furniture', 249.99, 30);
INSERT INTO products VALUES (4, 'Monitor', 'Electronics', 349.99, 75);
INSERT INTO customers VALUES (1, 'Online Shopper', 'shop@email.com', 'USA');
INSERT INTO customers VALUES (2, 'Bulk Buyer', 'bulk@email.com', 'UK');
INSERT INTO orders VALUES (1, 1, '2024-03-01', 1029.98, 'Shipped');
INSERT INTO orders VALUES (2, 2, '2024-03-05', 599.97, 'Processing');
INSERT INTO orders VALUES (3, 1, '2024-03-10', 349.99, 'Delivered');
INSERT INTO order_items VALUES (1, 1, 1, 1, 999.99);
INSERT INTO order_items VALUES (2, 1, 2, 1, 29.99);
INSERT INTO order_items VALUES (3, 2, 3, 2, 249.99);
INSERT INTO order_items VALUES (4, 2, 2, 1, 29.99);
INSERT INTO order_items VALUES (5, 3, 4, 1, 349.99);
`;

export const ecommerce = createSampleDb('ecommerce', 'E-Commerce', 'Products, customers, orders, and order items.', 'Retail', 'ShoppingCart', schemaSql, dataSql, 4, 14);
