import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, company_name TEXT, contact_name TEXT, country TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, freight REAL, ship_country TEXT);
CREATE TABLE order_details (detail_id INTEGER PRIMARY KEY, order_id INTEGER, product_name TEXT, quantity INTEGER, unit_price REAL);
`;

const dataSql = `
INSERT INTO customers VALUES (1, 'Acme Corp', 'John Buyer', 'USA');
INSERT INTO customers VALUES (2, 'Global Trade', 'Maria Seller', 'Germany');
INSERT INTO customers VALUES (3, 'Pacific Imports', 'Ken Tanaka', 'Japan');
INSERT INTO orders VALUES (1, 1, '2024-01-15', 25.50, 'USA');
INSERT INTO orders VALUES (2, 1, '2024-02-20', 30.00, 'USA');
INSERT INTO orders VALUES (3, 2, '2024-01-25', 45.00, 'Germany');
INSERT INTO orders VALUES (4, 3, '2024-03-01', 60.00, 'Japan');
INSERT INTO order_details VALUES (1, 1, 'Widget A', 10, 15.00);
INSERT INTO order_details VALUES (2, 1, 'Widget B', 5, 25.00);
INSERT INTO order_details VALUES (3, 2, 'Gadget X', 20, 10.00);
INSERT INTO order_details VALUES (4, 3, 'Part Y', 100, 5.00);
INSERT INTO order_details VALUES (5, 4, 'Component Z', 50, 8.00);
`;

export const orders = createSampleDb('orders', 'Orders', 'Customers, orders, and order details.', 'Business', 'Package', schemaSql, dataSql, 3, 12);
