-- Adds the reservation type used to split the calendar's time-grid columns:
--   NULL / 'medical'  -> rendered on the LEFT half of the day column
--   'grooming'        -> rendered on the RIGHT half
--
-- NULLABLE with no default, so every existing production row stays untouched
-- and simply falls back to the default (left) position. No backfill needed.
--
-- Run once:
--   mysql <db> < migrations/20260714_add_reservation_type_to_reservations.sql

ALTER TABLE reservations
    ADD COLUMN reservation_type VARCHAR(20) NULL DEFAULT NULL
        AFTER option_id;
