import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE warehouses (warehouse_id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE products (product_id INTEGER PRIMARY KEY, name TEXT, sku TEXT, unit_cost REAL);
CREATE TABLE stock (stock_id INTEGER PRIMARY KEY, warehouse_id INTEGER, product_id INTEGER, quantity INTEGER, last_updated TEXT);
`;

const dataSql = `
INSERT INTO warehouses VALUES (1, 'East Coast Hub', 'New York');
INSERT INTO warehouses VALUES (2, 'West Coast Hub', 'Los Angeles');
INSERT INTO warehouses VALUES (3, 'Central Depot', 'Chicago');
INSERT INTO products VALUES (1, 'Steel Bolt M8', 'SKU-001', 0.50);
INSERT INTO products VALUES (2, 'Aluminum Sheet', 'SKU-002', 15.00);
INSERT INTO products VALUES (3, 'Rubber Gasket', 'SKU-003', 2.25);
INSERT INTO products VALUES (4, 'Copper Wire 10m', 'SKU-004', 8.75);
INSERT INTO stock VALUES (1, 1, 1, 5000, '2024-03-01');
INSERT INTO stock VALUES (2, 1, 2, 200, '2024-03-01');
INSERT INTO stock VALUES (3, 2, 1, 3000, '2024-03-05');
INSERT INTO stock VALUES (4, 2, 3, 1500, '2024-03-05');
INSERT INTO stock VALUES (5, 3, 4, 800, '2024-03-10');
INSERT INTO stock VALUES (6, 3, 2, 100, '2024-03-10');
`;

export const inventory = createSampleDb('inventory', 'Inventory', 'Warehouses, products, and stock levels.', 'Logistics', 'Warehouse', schemaSql, dataSql, 3, 13);
