import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE departments (dept_id INTEGER PRIMARY KEY, dept_name TEXT, building TEXT);
CREATE TABLE professors (prof_id INTEGER PRIMARY KEY, name TEXT, dept_id INTEGER, salary REAL);
CREATE TABLE students (student_id INTEGER PRIMARY KEY, name TEXT, major_dept_id INTEGER, year INTEGER, gpa REAL);
`;

const dataSql = `
INSERT INTO departments VALUES (1, 'Computer Science', 'Engineering Hall');
INSERT INTO departments VALUES (2, 'Mathematics', 'Science Building');
INSERT INTO departments VALUES (3, 'English', 'Humanities Center');
INSERT INTO professors VALUES (1, 'Prof. Turing', 1, 95000);
INSERT INTO professors VALUES (2, 'Prof. Euler', 2, 88000);
INSERT INTO professors VALUES (3, 'Prof. Austen', 3, 75000);
INSERT INTO students VALUES (1, 'Student A', 1, 2, 3.5);
INSERT INTO students VALUES (2, 'Student B', 1, 3, 3.8);
INSERT INTO students VALUES (3, 'Student C', 2, 1, 3.2);
INSERT INTO students VALUES (4, 'Student D', 3, 4, 3.9);
`;

export const university = createSampleDb('university', 'University', 'Departments, professors, and students.', 'Education', 'Building2', schemaSql, dataSql, 3, 10);
