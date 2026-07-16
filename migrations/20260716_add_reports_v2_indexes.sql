-- Indexes for the Reports v2 endpoints (idempotent — guarded like the earlier
-- performance-index migration).
--
--   journal_vouchers.journal_number : expenses / supplier-payment / payment
--                                     queries filter with LIKE 'EXP%' etc. —
--                                     sargable only with this index.
--   journal_vouchers.journal_date   : every financial query bounds on it.
--   purchase_orders.order_datetime  : purchases-in-period aggregate.
--
-- Run once:
--   mysql <db> < migrations/20260716_add_reports_v2_indexes.sql

SET @idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'journal_vouchers'
      AND INDEX_NAME = 'idx_jv_number');
SET @ddl := IF(@idx = 0,
    'CREATE INDEX idx_jv_number ON journal_vouchers (journal_number)', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'journal_vouchers'
      AND INDEX_NAME = 'idx_jv_date');
SET @ddl := IF(@idx = 0,
    'CREATE INDEX idx_jv_date ON journal_vouchers (journal_date)', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @idx := (SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'purchase_orders'
      AND INDEX_NAME = 'idx_po_datetime');
SET @ddl := IF(@idx = 0,
    'CREATE INDEX idx_po_datetime ON purchase_orders (order_datetime)', 'SELECT 1');
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;
