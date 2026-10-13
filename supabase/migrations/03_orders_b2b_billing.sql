-- Migration for LUXORA HOME B2B Billing (Company Invoicing)
-- File: supabase/migrations/03_orders_b2b_billing.sql

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS billing_type TEXT DEFAULT 'individual',
    ADD COLUMN IF NOT EXISTS company_name TEXT,
    ADD COLUMN IF NOT EXISTS cui TEXT,
    ADD COLUMN IF NOT EXISTS reg_com TEXT;
