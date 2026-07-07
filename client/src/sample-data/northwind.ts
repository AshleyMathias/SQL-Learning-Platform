import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE categories (category_id INTEGER PRIMARY KEY, category_name TEXT, description TEXT);
CREATE TABLE suppliers (supplier_id INTEGER PRIMARY KEY, company_name TEXT, contact_name TEXT, country TEXT);
CREATE TABLE products (product_id INTEGER PRIMARY KEY, product_name TEXT, supplier_id INTEGER, category_id INTEGER, unit_price REAL, units_in_stock INTEGER);
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, company_name TEXT, contact_name TEXT, city TEXT, country TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, ship_city TEXT);
CREATE TABLE order_details (order_id INTEGER, product_id INTEGER, unit_price REAL, quantity INTEGER);
`;

const dataSql = `
INSERT INTO categories VALUES (1, 'Beverages', 'Soft drinks and juices');
INSERT INTO categories VALUES (2, 'Condiments', 'Sauces and spreads');
INSERT INTO categories VALUES (3, 'Dairy', 'Cheeses and milk products');
INSERT INTO suppliers VALUES (1, 'Exotic Liquids', 'Charlotte Cooper', 'UK');
INSERT INTO suppliers VALUES (2, 'Tokyo Traders', 'Yoshi Nagase', 'Japan');
INSERT INTO products VALUES (1, 'Chai', 1, 1, 18.00, 39);
INSERT INTO products VALUES (2, 'Chang', 1, 1, 19.00, 17);
INSERT INTO products VALUES (3, 'Aniseed Syrup', 1, 2, 10.00, 13);
INSERT INTO products VALUES (4, 'Chef Anton Gumbo Mix', 2, 2, 21.35, 0);
INSERT INTO products VALUES (5, 'Mozzarella', 2, 3, 32.00, 25);
INSERT INTO customers VALUES (1, 'Alfreds Futterkiste', 'Maria Anders', 'Berlin', 'Germany');
INSERT INTO customers VALUES (2, 'Around the Horn', 'Thomas Hardy', 'London', 'UK');
INSERT INTO customers VALUES (3, 'Bottom-Dollar Markets', 'Elizabeth Lincoln', 'Tsawassen', 'Canada');
INSERT INTO orders VALUES (1, 1, '2024-07-04', 'Berlin');
INSERT INTO orders VALUES (2, 2, '2024-07-05', 'London');
INSERT INTO orders VALUES (3, 1, '2024-07-08', 'Berlin');
INSERT INTO order_details VALUES (1, 1, 18.00, 10);
INSERT INTO order_details VALUES (1, 2, 19.00, 5);
INSERT INTO order_details VALUES (2, 3, 10.00, 20);
INSERT INTO order_details VALUES (3, 5, 32.00, 3);
`;

export const northwind = createSampleDb('northwind', 'Northwind', 'Northwind-inspired dataset with categories, products, orders.', 'Classic', 'Globe', schemaSql, dataSql, 6, 22);
