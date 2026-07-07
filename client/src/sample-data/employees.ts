import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, title TEXT, reports_to INTEGER, hire_date TEXT, salary REAL);
CREATE TABLE departments (department_id INTEGER PRIMARY KEY, department_name TEXT, location TEXT);
CREATE TABLE employee_dept (employee_id INTEGER, department_id INTEGER);
`;

const dataSql = `
INSERT INTO employees VALUES (1, 'Nancy', 'Davolio', 'Sales Representative', 2, '2010-05-01', 55000);
INSERT INTO employees VALUES (2, 'Andrew', 'Fuller', 'Vice President', NULL, '2005-08-14', 120000);
INSERT INTO employees VALUES (3, 'Janet', 'Leverling', 'Sales Representative', 2, '2012-04-01', 52000);
INSERT INTO employees VALUES (4, 'Margaret', 'Peacock', 'Sales Manager', 2, '2008-09-15', 75000);
INSERT INTO employees VALUES (5, 'Steven', 'Buchanan', 'Sales Manager', 2, '2009-10-17', 72000);
INSERT INTO departments VALUES (1, 'Sales', 'Seattle');
INSERT INTO departments VALUES (2, 'Engineering', 'Portland');
INSERT INTO departments VALUES (3, 'HR', 'Seattle');
INSERT INTO employee_dept VALUES (1, 1);
INSERT INTO employee_dept VALUES (2, 1);
INSERT INTO employee_dept VALUES (3, 1);
INSERT INTO employee_dept VALUES (4, 1);
INSERT INTO employee_dept VALUES (5, 3);
`;

export const employees = createSampleDb('employees', 'Employees', 'Employee hierarchy and departments — great for self-joins.', 'Business', 'Briefcase', schemaSql, dataSql, 3, 13);
