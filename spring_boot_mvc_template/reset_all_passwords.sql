-- Try different passwords for the vendor account
-- Password: "test123" - hash: $2a$10$PvqEa14ELT/u2j9cNbvH/e3KCQrONxYJ1EbxdD/j4WXfRajTkxP7e
-- Password: "password123" - hash: $2a$10$V8nQmrSrSx8qH6V8bPvJ9uI7vK6T1gHb2xJ4jN3mL5pQ8sR9uW2Ky
UPDATE B2BEcom.users SET password='$2a$10$PvqEa14ELT/u2j9cNbvH/e3KCQrONxYJ1EbxdD/j4WXfRajTkxP7e' WHERE email='vendor@b2b.com';
UPDATE B2BEcom.users SET password='$2a$10$PvqEa14ELT/u2j9cNbvH/e3KCQrONxYJ1EbxdD/j4WXfRajTkxP7e' WHERE email='shopkeeper@b2b.com';
UPDATE B2BEcom.users SET password='$2a$10$PvqEa14ELT/u2j9cNbvH/e3KCQrONxYJ1EbxdD/j4WXfRajTkxP7e' WHERE email='admin@b2b.com';
SELECT email, password FROM B2BEcom.users;
