-- Update admin password to BCrypt hash for "hello"
-- This is the BCrypt hash for password "hello": $2a$10$KA0.BuisoTAf8X5C8ijDa.sZr5MvwqILCR1LX6fOGKXZLfnJbBGjy
UPDATE B2BEcom.users SET password='$2a$10$KA0.BuisoTAf8X5C8ijDa.sZr5MvwqILCR1LX6fOGKXZLfnJbBGjy' WHERE email='admin@b2b.com';
SELECT id, email, name, password FROM B2BEcom.users WHERE email='admin@b2b.com';
