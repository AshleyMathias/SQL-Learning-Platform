import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE patients (patient_id INTEGER PRIMARY KEY, name TEXT, age INTEGER, blood_type TEXT, admission_date TEXT);
CREATE TABLE doctors (doctor_id INTEGER PRIMARY KEY, name TEXT, specialty TEXT, department TEXT);
CREATE TABLE appointments (appointment_id INTEGER PRIMARY KEY, patient_id INTEGER, doctor_id INTEGER, appointment_date TEXT, status TEXT);
`;

const dataSql = `
INSERT INTO patients VALUES (1, 'John Patient', 45, 'O+', '2024-01-10');
INSERT INTO patients VALUES (2, 'Mary Health', 32, 'A+', '2024-02-15');
INSERT INTO patients VALUES (3, 'Sam Recovery', 67, 'B-', '2024-03-01');
INSERT INTO doctors VALUES (1, 'Dr. Smith', 'Cardiology', 'Heart Center');
INSERT INTO doctors VALUES (2, 'Dr. Jones', 'Neurology', 'Brain Institute');
INSERT INTO doctors VALUES (3, 'Dr. Lee', 'General', 'Primary Care');
INSERT INTO appointments VALUES (1, 1, 1, '2024-03-15', 'Completed');
INSERT INTO appointments VALUES (2, 2, 3, '2024-03-20', 'Scheduled');
INSERT INTO appointments VALUES (3, 3, 2, '2024-04-01', 'Scheduled');
INSERT INTO appointments VALUES (4, 1, 3, '2024-04-10', 'Cancelled');
`;

export const hospital = createSampleDb('hospital', 'Hospital', 'Patients, doctors, and appointments.', 'Healthcare', 'Heart', schemaSql, dataSql, 3, 10);
