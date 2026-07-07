import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE employees (emp_id INTEGER PRIMARY KEY, name TEXT, department TEXT, title TEXT, salary REAL, hire_date TEXT);
CREATE TABLE projects (project_id INTEGER PRIMARY KEY, name TEXT, budget REAL, start_date TEXT, status TEXT);
CREATE TABLE assignments (id INTEGER PRIMARY KEY, emp_id INTEGER, project_id INTEGER, hours INTEGER);
`;

const dataSql = `
INSERT INTO employees VALUES (1, 'Sarah Manager', 'Engineering', 'Manager', 95000, '2018-03-01');
INSERT INTO employees VALUES (2, 'Mike Developer', 'Engineering', 'Senior Dev', 85000, '2019-06-15');
INSERT INTO employees VALUES (3, 'Lisa Analyst', 'Data', 'Analyst', 70000, '2020-01-10');
INSERT INTO employees VALUES (4, 'Tom Designer', 'Design', 'UX Designer', 75000, '2021-04-20');
INSERT INTO projects VALUES (1, 'Website Redesign', 50000, '2024-01-01', 'Active');
INSERT INTO projects VALUES (2, 'Data Pipeline', 80000, '2024-02-15', 'Active');
INSERT INTO projects VALUES (3, 'Mobile App', 120000, '2023-09-01', 'Completed');
INSERT INTO assignments VALUES (1, 1, 1, 20);
INSERT INTO assignments VALUES (2, 2, 1, 40);
INSERT INTO assignments VALUES (3, 2, 2, 30);
INSERT INTO assignments VALUES (4, 3, 2, 40);
INSERT INTO assignments VALUES (5, 4, 1, 35);
`;

export const hr = createSampleDb('hr', 'HR', 'Employees, projects, and assignments.', 'Business', 'Users', schemaSql, dataSql, 3, 12);
