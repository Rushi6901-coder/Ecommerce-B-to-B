-- Update admin passwords with the correctly generated BCrypt hash for "admin123"
UPDATE B2BEcom.users SET password='$2a$10$0NG8CWd1fR2k0BOUqYggOOj7tiioTHzRHcKZCy85rq7KmbzfNJYvu' WHERE email='admin@b2b.com';
UPDATE B2BEcom.users SET password='$2a$10$0NG8CWd1fR2k0BOUqYggOOj7tiioTHzRHcKZCy85rq7KmbzfNJYvu' WHERE email='vendor@b2b.com';
UPDATE B2BEcom.users SET password='$2a$10$0NG8CWd1fR2k0BOUqYggOOj7tiioTHzRHcKZCy85rq7KmbzfNJYvu' WHERE email='shopkeeper@b2b.com';

SELECT email, password FROM B2BEcom.users;
