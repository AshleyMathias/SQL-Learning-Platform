import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT, email TEXT, city TEXT, balance REAL);
CREATE TABLE accounts (account_id INTEGER PRIMARY KEY, customer_id INTEGER, account_type TEXT, balance REAL, opened_date TEXT);
CREATE TABLE transactions (transaction_id INTEGER PRIMARY KEY, account_id INTEGER, amount REAL, transaction_type TEXT, transaction_date TEXT);
`;

const dataSql = `
INSERT INTO customers VALUES (1, 'Alice Finance', 'alice@bank.com', 'New York', 5000.00);
INSERT INTO customers VALUES (2, 'Bob Saver', 'bob@bank.com', 'Chicago', 12000.50);
INSERT INTO customers VALUES (3, 'Carol Investor', 'carol@bank.com', 'San Francisco', 25000.00);
INSERT INTO accounts VALUES (1, 1, 'Checking', 2500.00, '2020-01-15');
INSERT INTO accounts VALUES (2, 1, 'Savings', 2500.00, '2020-01-15');
INSERT INTO accounts VALUES (3, 2, 'Checking', 12000.50, '2019-06-01');
INSERT INTO accounts VALUES (4, 3, 'Investment', 25000.00, '2018-03-10');
INSERT INTO transactions VALUES (1, 1, -150.00, 'Debit', '2024-03-01');
INSERT INTO transactions VALUES (2, 1, 3000.00, 'Deposit', '2024-03-05');
INSERT INTO transactions VALUES (3, 3, -500.00, 'Debit', '2024-03-10');
INSERT INTO transactions VALUES (4, 4, 1000.00, 'Deposit', '2024-03-15');
`;

export const bank = createSampleDb('bank', 'Bank', 'Customers, accounts, and transactions for aggregate practice.', 'Finance', 'Landmark', schemaSql, dataSql, 3, 11);
