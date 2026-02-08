-- Known BCrypt hashes for testing:
-- Password: "admin" hash: $2a$10$V5pOYpHvHNUZ3dqfBzqXKeDx0qLO0LVWDyqy5YrpvQAeLPi05rBVa
-- Password: "password" hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
-- Password: "test123" hash: $2a$10$PvqEa14ELT/u2j9cNbvH/e3KCQrONxYJ1EbxdD/j4WXfRajTkxP7e

UPDATE B2BEcom.users SET password='$2a$10$V5pOYpHvHNUZ3dqfBzqXKeDx0qLO0LVWDyqy5YrpvQAeLPi05rBVa' WHERE email='admin@b2b.com';

SELECT email, password FROM B2BEcom.users WHERE email='admin@b2b.com';
