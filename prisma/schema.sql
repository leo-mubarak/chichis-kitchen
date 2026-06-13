-- ============================================
-- Chichi's Kitchen - MySQL Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS chichis_kitchen
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE chichis_kitchen;

-- Admins table
CREATE TABLE admins (
  id         VARCHAR(30)  NOT NULL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(50)  NOT NULL DEFAULT 'admin',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id         VARCHAR(30)  NOT NULL PRIMARY KEY,
  fullname   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20)  NOT NULL,
  address    TEXT         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE menu_items (
  id          VARCHAR(30)  NOT NULL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT         NOT NULL,
  image       VARCHAR(500) NOT NULL DEFAULT '',
  category    VARCHAR(100) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Menu sizes (prices per portion)
CREATE TABLE menu_sizes (
  id           VARCHAR(30)    NOT NULL PRIMARY KEY,
  label        VARCHAR(100)   NOT NULL,
  price        DECIMAL(10, 2) NOT NULL,
  menu_item_id VARCHAR(30)    NOT NULL,
  CONSTRAINT fk_menu_sizes_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
  id               VARCHAR(30)    NOT NULL PRIMARY KEY,
  customer_id      VARCHAR(30)    NOT NULL,
  total_amount     DECIMAL(10, 2) NOT NULL,
  status           ENUM(
                     'PENDING',
                     'CONFIRMED',
                     'PREPARING',
                     'OUT_FOR_DELIVERY',
                     'DELIVERED',
                     'CANCELLED'
                   ) NOT NULL DEFAULT 'PENDING',
  delivery_address TEXT           NOT NULL,
  notes            TEXT,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
                     ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Order items (line items)
CREATE TABLE order_items (
  id           VARCHAR(30)    NOT NULL PRIMARY KEY,
  order_id     VARCHAR(30)    NOT NULL,
  menu_item_id VARCHAR(30)    NOT NULL,
  size_label   VARCHAR(100)   NOT NULL,
  quantity     INT            NOT NULL DEFAULT 1,
  subtotal     DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Indexes for performance
CREATE INDEX idx_orders_customer    ON orders(customer_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_created     ON orders(created_at DESC);
CREATE INDEX idx_order_items_order  ON order_items(order_id);
CREATE INDEX idx_order_items_menu   ON order_items(menu_item_id);
CREATE INDEX idx_menu_sizes_item    ON menu_sizes(menu_item_id);
