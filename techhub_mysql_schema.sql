-- ============================================================
-- TechHub E-Commerce Database Schema
-- MySQL / phpMyAdmin Compatible
-- Generated based on actual application code analysis
-- ============================================================

CREATE DATABASE IF NOT EXISTS techhub;
USE techhub;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- DROP EXISTING TABLES (for clean import)
-- ============================================================

DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- USERS TABLE
-- Stores user accounts including admins
-- ============================================================

CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    INDEX idx_users_is_admin (is_admin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCTS TABLE
-- Stores product catalog information
-- ============================================================

CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_products_category (category),
    INDEX idx_products_price (price),
    INDEX idx_products_name (name(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CART_ITEMS TABLE
-- Stores shopping cart items for users
-- ============================================================

CREATE TABLE cart_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_cart_user_product (user_id, product_id),
    INDEX idx_cart_user_id (user_id),
    INDEX idx_cart_product_id (product_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ORDERS TABLE
-- Stores order header information
-- ============================================================

CREATE TABLE orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ORDER_ITEMS TABLE
-- Stores individual items within an order
-- ============================================================

CREATE TABLE order_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- OFFERS TABLE
-- Stores promotional offers and discounts on products
-- ============================================================

CREATE TABLE offers (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    offer_price DECIMAL(10,2) NOT NULL,
    discount_percent TINYINT UNSIGNED NOT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    title VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_offers_product_id (product_id),
    INDEX idx_offers_is_active (is_active),
    INDEX idx_offers_dates (start_date, end_date),
    CONSTRAINT fk_offers_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WISHLIST TABLE
-- Stores user wishlists
-- ============================================================

CREATE TABLE wishlist (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_wishlist_user_product (user_id, product_id),
    INDEX idx_wishlist_user_id (user_id),
    INDEX idx_wishlist_product_id (product_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- REVIEWS TABLE
-- Stores product reviews and ratings by users
-- ============================================================

CREATE TABLE reviews (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_reviews_user_product (user_id, product_id),
    INDEX idx_reviews_product_id (product_id),
    INDEX idx_reviews_user_id (user_id),
    INDEX idx_reviews_rating (rating),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CONTACTS TABLE
-- Stores contact form submissions
-- ============================================================

CREATE TABLE contacts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_contacts_is_read (is_read),
    INDEX idx_contacts_created_at (created_at),
    INDEX idx_contacts_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- NOTIFICATIONS TABLE
-- Stores system notifications
-- ============================================================

CREATE TABLE notifications (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED DEFAULT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    is_sent TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_type (type),
    INDEX idx_notifications_is_sent (is_sent),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PASSWORD_RESETS TABLE
-- Stores password reset tokens
-- ============================================================

CREATE TABLE password_resets (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_password_resets_token (token),
    INDEX idx_password_resets_user_id (user_id),
    INDEX idx_password_resets_expires_at (expires_at),
    CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ADDRESSES TABLE
-- Stores user shipping/billing addresses
-- ============================================================

CREATE TABLE addresses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    type VARCHAR(50) DEFAULT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    name VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address_line1 VARCHAR(255) DEFAULT NULL,
    address_line2 VARCHAR(255) DEFAULT NULL,
    street VARCHAR(255) DEFAULT NULL,
    apartment VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,
    zip_code VARCHAR(20) DEFAULT NULL,
    zip VARCHAR(20) DEFAULT NULL,
    country VARCHAR(100) DEFAULT 'USA',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_addresses_user_id (user_id),
    INDEX idx_addresses_is_default (is_default),
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
