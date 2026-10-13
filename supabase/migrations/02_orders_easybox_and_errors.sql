-- Migration for LUXORA HOME Easybox, Fail-Safe Fields Extension & Security Hardening
-- File: supabase/migrations/02_orders_easybox_and_errors.sql

ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'address' NOT NULL,
    ADD COLUMN IF NOT EXISTS easybox_id TEXT,
    ADD COLUMN IF NOT EXISTS easybox_name TEXT,
    ADD COLUMN IF NOT EXISTS awb_error TEXT,
    ADD COLUMN IF NOT EXISTS invoice_error TEXT,
    ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Index for fast idempotency lookup
CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key);

-- Security RLS Hardening (Prevents Client-Side REST API Bypass of Pricing)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Remove public inserts if present to enforce server-side API validation
DROP POLICY IF EXISTS "Allow anonymous insert orders" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;

-- Service Role Key (used in /api/orders) automatically bypasses RLS natively.
