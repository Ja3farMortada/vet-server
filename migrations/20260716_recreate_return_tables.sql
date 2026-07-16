-- Recreates the customer RETURN tables with a schema that actually matches this
-- database's conventions (mirrors sales_orders / sales_order_items).
--
-- WHY DROP: the previous return_orders / return_order_items were a half-port from
-- the morexa (multi-user) schema and were never usable — the old ReturnModel
-- inserted journal_vouchers(user_id), journal_items{user_id} and
-- inventory_transactions(user_id_fk), none of which exist in this DB, so every
-- call would have thrown. Both tables were verified EMPTY (0 rows) before this
-- migration was written, so dropping them loses nothing.
--
--   >>> VERIFY BEFORE RUNNING:
--       SELECT COUNT(*) FROM return_orders;        -- expect 0
--       SELECT COUNT(*) FROM return_order_items;   -- expect 0
--   If either is non-zero, STOP and migrate the data instead of dropping.
--
-- Differences vs the old tables:
--   + variant_id on items (returns target the same variant/expiry a sale did)
--   + order_notes / updated_at / update_reason / deleted_at / delete_reason
--     (edit + soft-delete parity with sales_orders)
--   + exchange_rate
--   - user_id (sales_orders has no user_id; orders are not per-user here)
--
-- Run once:
--   mysql <db> < migrations/20260716_recreate_return_tables.sql

DROP TABLE IF EXISTS return_order_items;
DROP TABLE IF EXISTS return_orders;

CREATE TABLE return_orders (
    order_id            INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number      VARCHAR(100) NULL,
    journal_voucher_id  INT NULL,
    customer_id         INT NULL,
    order_datetime      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount        DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_cost          DECIMAL(10,2) NOT NULL DEFAULT 0,
    -- Cash handed back to the customer, and the voucher that posted it. Stored on
    -- the return itself so an edit/delete can re-post or remove the refund —
    -- otherwise the refund voucher would be orphaned and the books left wrong.
    -- refund_date is kept so re-posting on edit cannot silently move the cash
    -- movement into a different accounting period.
    refund_amount       DECIMAL(10,2) NOT NULL DEFAULT 0,
    refund_voucher_id   INT NULL,
    refund_date         DATETIME NULL,
    exchange_rate       DECIMAL(20,2) NULL,
    order_notes         VARCHAR(255) NULL,
    is_deleted          TINYINT(1) NOT NULL DEFAULT 0,
    updated_at          DATETIME NULL,
    update_reason       VARCHAR(255) NULL,
    deleted_at          DATETIME NULL,
    delete_reason       VARCHAR(255) NULL,
    INDEX idx_return_orders_customer (customer_id),
    INDEX idx_return_orders_datetime (order_datetime),
    -- UNIQUE: invoice numbers are allocated with an unlocked MAX(...)+1, so two
    -- concurrent returns can compute the same RET####. The unique key turns that
    -- race into a failed INSERT that rolls the transaction back, instead of two
    -- committed returns sharing an invoice number.
    UNIQUE KEY idx_return_orders_invoice (invoice_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE return_order_items (
    order_item_id   INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    product_id      INT NOT NULL,
    variant_id      INT NULL,
    quantity        DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_price      DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit_cost       DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_price     DECIMAL(10,2) NOT NULL DEFAULT 0,
    price_type      ENUM('unit_price_usd','whole_price_usd','grandwhole_price_usd','latest')
                        NULL DEFAULT 'unit_price_usd',
    is_deleted      TINYINT(1) NOT NULL DEFAULT 0,
    INDEX idx_return_items_order (order_id),
    INDEX idx_return_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
