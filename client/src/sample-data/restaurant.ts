import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE menu_items (item_id INTEGER PRIMARY KEY, name TEXT, category TEXT, price REAL, is_available INTEGER);
CREATE TABLE tables (table_id INTEGER PRIMARY KEY, capacity INTEGER, section TEXT);
CREATE TABLE reservations (reservation_id INTEGER PRIMARY KEY, table_id INTEGER, customer_name TEXT, party_size INTEGER, reservation_time TEXT);
`;

const dataSql = `
INSERT INTO menu_items VALUES (1, 'Margherita Pizza', 'Main', 14.99, 1);
INSERT INTO menu_items VALUES (2, 'Caesar Salad', 'Starter', 8.99, 1);
INSERT INTO menu_items VALUES (3, 'Tiramisu', 'Dessert', 7.99, 1);
INSERT INTO menu_items VALUES (4, 'Pasta Carbonara', 'Main', 16.99, 1);
INSERT INTO menu_items VALUES (5, 'Soup of the Day', 'Starter', 6.99, 0);
INSERT INTO tables VALUES (1, 2, 'Window');
INSERT INTO tables VALUES (2, 4, 'Main Hall');
INSERT INTO tables VALUES (3, 6, 'Patio');
INSERT INTO tables VALUES (4, 8, 'Private Room');
INSERT INTO reservations VALUES (1, 1, 'John D.', 2, '2024-03-15 19:00');
INSERT INTO reservations VALUES (2, 2, 'Family Smith', 4, '2024-03-15 20:00');
INSERT INTO reservations VALUES (3, 3, 'Team Lunch', 6, '2024-03-16 12:30');
`;

export const restaurant = createSampleDb('restaurant', 'Restaurant', 'Menu items, tables, and reservations.', 'Hospitality', 'UtensilsCrossed', schemaSql, dataSql, 3, 12);
