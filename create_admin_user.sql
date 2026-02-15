-- ============================================================
-- Create Admin User for TechHub
-- Run this in Supabase SQL Editor after running supabase_schema.sql
-- ============================================================

-- Insert admin user (password: 12345678)
INSERT INTO users (name, email, phone, password, is_admin, created_at) 
VALUES (
    'Admin User',
    'mhmd12@gmail.com',
    '1234567890',
    '$2a$10$EZqwZEizUJPkCH1x4VJk7.P.ObzhkaWJ9sdq4nHCa5fm480iCV/LC',
    true,
    CURRENT_TIMESTAMP
);

-- Verify the user was created
SELECT id, name, email, is_admin, created_at FROM users WHERE email = 'mhmd12@gmail.com';

-- ============================================================
-- IMPORTANT NOTES:
-- ============================================================
-- 1. The password hash above is for: 12345678
-- 2. Change this password after first login for security!
-- 3. You can create more users with this template
-- ============================================================

-- Optional: Create a regular test user (password: testuser123)
-- INSERT INTO users (name, email, phone, password, is_admin) 
-- VALUES (
--     'Test Customer',
--     'test@example.com',
--     '9876543210',
--     '$2a$10$CwTycUXWue0Thq9StjUM0uJ8cJ0.n5lJ4aR.O1lXR9R8L8L8L8L8L',
--     false
-- );
