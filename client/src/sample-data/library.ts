import { createSampleDb } from './helpers';

const schemaSql = `
CREATE TABLE books (book_id INTEGER PRIMARY KEY, title TEXT, author TEXT, isbn TEXT, genre TEXT, published_year INTEGER);
CREATE TABLE members (member_id INTEGER PRIMARY KEY, name TEXT, email TEXT, join_date TEXT, membership_type TEXT);
CREATE TABLE loans (loan_id INTEGER PRIMARY KEY, book_id INTEGER, member_id INTEGER, loan_date TEXT, return_date TEXT);
`;

const dataSql = `
INSERT INTO books VALUES (1, 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 'Fiction', 1925);
INSERT INTO books VALUES (2, 'To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 'Fiction', 1960);
INSERT INTO books VALUES (3, 'Clean Code', 'Robert Martin', '978-0132350884', 'Technology', 2008);
INSERT INTO books VALUES (4, '1984', 'George Orwell', '978-0451524935', 'Fiction', 1949);
INSERT INTO books VALUES (5, 'SQL for Mere Mortals', 'John Viescas', '978-0134858334', 'Technology', 2018);
INSERT INTO members VALUES (1, 'Jane Reader', 'jane@email.com', '2023-01-15', 'Premium');
INSERT INTO members VALUES (2, 'Tom Bookworm', 'tom@email.com', '2023-06-01', 'Standard');
INSERT INTO members VALUES (3, 'Lisa Scholar', 'lisa@email.com', '2024-02-10', 'Premium');
INSERT INTO loans VALUES (1, 1, 1, '2024-01-10', '2024-02-10');
INSERT INTO loans VALUES (2, 3, 1, '2024-03-01', NULL);
INSERT INTO loans VALUES (3, 5, 2, '2024-01-20', '2024-02-20');
INSERT INTO loans VALUES (4, 2, 3, '2024-04-01', NULL);
`;

export const library = createSampleDb('library', 'Library', 'Books, members, and loans for practicing JOINs and NULL handling.', 'Public Services', 'BookOpen', schemaSql, dataSql, 3, 12);
