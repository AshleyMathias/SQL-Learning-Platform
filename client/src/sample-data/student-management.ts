import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE students (
  student_id INTEGER PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  age INTEGER,
  enrollment_date TEXT,
  gpa REAL
);

CREATE TABLE courses (
  course_id INTEGER PRIMARY KEY,
  course_name TEXT NOT NULL,
  credits INTEGER,
  department TEXT
);

CREATE TABLE enrollments (
  enrollment_id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(student_id),
  course_id INTEGER REFERENCES courses(course_id),
  grade TEXT,
  semester TEXT
);
`;

const dataSql = `
INSERT INTO students VALUES (1, 'Alice', 'Johnson', 'alice@school.edu', 20, '2023-09-01', 3.8);
INSERT INTO students VALUES (2, 'Bob', 'Smith', 'bob@school.edu', 19, '2023-09-01', 3.2);
INSERT INTO students VALUES (3, 'Carol', 'Williams', 'carol@school.edu', 21, '2022-09-01', 3.9);
INSERT INTO students VALUES (4, 'David', 'Brown', 'david@school.edu', 18, '2024-01-15', 2.8);
INSERT INTO students VALUES (5, 'Eva', 'Davis', 'eva@school.edu', 22, '2021-09-01', 3.5);
INSERT INTO students VALUES (6, 'Frank', 'Miller', 'frank@school.edu', 20, '2023-09-01', NULL);
INSERT INTO students VALUES (7, 'Grace', 'Wilson', 'grace@school.edu', 19, '2023-09-01', 3.7);
INSERT INTO students VALUES (8, 'Henry', 'Moore', 'henry@school.edu', 23, '2020-09-01', 3.1);

INSERT INTO courses VALUES (1, 'Introduction to SQL', 3, 'Computer Science');
INSERT INTO courses VALUES (2, 'Database Design', 4, 'Computer Science');
INSERT INTO courses VALUES (3, 'Calculus I', 4, 'Mathematics');
INSERT INTO courses VALUES (4, 'English Literature', 3, 'Humanities');
INSERT INTO courses VALUES (5, 'Physics 101', 4, 'Science');

INSERT INTO enrollments VALUES (1, 1, 1, 'A', 'Fall 2023');
INSERT INTO enrollments VALUES (2, 1, 3, 'B+', 'Fall 2023');
INSERT INTO enrollments VALUES (3, 2, 1, 'B', 'Fall 2023');
INSERT INTO enrollments VALUES (4, 2, 4, 'A-', 'Fall 2023');
INSERT INTO enrollments VALUES (5, 3, 2, 'A', 'Spring 2023');
INSERT INTO enrollments VALUES (6, 3, 5, 'A+', 'Fall 2023');
INSERT INTO enrollments VALUES (7, 4, 1, 'C+', 'Spring 2024');
INSERT INTO enrollments VALUES (8, 5, 2, 'B+', 'Fall 2022');
INSERT INTO enrollments VALUES (9, 7, 1, 'A', 'Fall 2023');
INSERT INTO enrollments VALUES (10, 8, 3, 'B', 'Fall 2020');
`;

export const studentManagement = createSampleDb(
  'student-management',
  'Student Management',
  'Students, courses, and enrollments — perfect for learning SELECT and JOINs.',
  'Education',
  'GraduationCap',
  schemaSql,
  dataSql,
  3,
  23
);
