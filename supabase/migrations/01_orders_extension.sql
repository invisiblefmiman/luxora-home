-- Migration for LUXORA HOME Orders Table Extension
-- File: supabase/migrations/01_orders_extension.sql

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    county TEXT NOT NULL,
    city TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    building TEXT,
    entrance TEXT,
    apartment TEXT,
    postal_code TEXT,
    quantity INTEGER DEFAULT 1 NOT NULL,
    order_bump_included BOOLEAN DEFAULT FALSE NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cod' NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'returned', 'cancelled')),
    awb_number TEXT,
    carrier_name TEXT,
    invoice_number TEXT,
    client_ip TEXT,
    notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 1. Policy for Public/Anonymous Insertion (Order placement)
DROP POLICY IF EXISTS "Allow anonymous insert orders" ON public.orders;
CREATE POLICY "Allow anonymous insert orders"
ON public.orders
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- 2. Policy for Authenticated/Admin Access (Select, Update, Delete)
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.orders;
CREATE POLICY "Allow authenticated full access"
ON public.orders
FOR ALL
TO service_role, authenticated
USING (true)
WITH CHECK (true);
