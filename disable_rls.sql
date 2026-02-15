-- ============================================================
-- DISABLE ROW LEVEL SECURITY FOR BACKEND JWT AUTH
-- Run this in Supabase SQL Editor if you're using backend JWT authentication
-- (not Supabase Auth)
-- ============================================================

-- The schema includes RLS policies that use Supabase's auth.uid()
-- Since you're using JWT authentication from your backend, not Supabase Auth,
-- you need to disable RLS to allow backend connections

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Drop the policies (they won't work with your JWT backend auth)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can manage own wishlist" ON wishlist;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;

-- ============================================================
-- IMPORTANT NOTES:
-- ============================================================
-- 1. This disables Supabase's Row Level Security
-- 2. Your backend handles authentication via JWT tokens
-- 3. Security is enforced in your Node.js backend code
-- 4. This is the correct setup for your current architecture
-- 
-- If you want to use Supabase Auth in the future, you would:
-- - Enable RLS again
-- - Use Supabase's client libraries for authentication
-- - Modify the policies to work with Supabase Auth
-- ============================================================

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'orders', 'cart_items', 'wishlist', 'addresses', 'products');

-- You should see rowsecurity = false for all tables
