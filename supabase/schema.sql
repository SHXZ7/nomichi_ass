-- SQL Schema Setup for Nomichi Trip Desk
-- Execute this script in your Supabase SQL Editor to initialize the database tables.

-- 1. Create Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    price DOUBLE PRECISION NOT NULL,
    total_seats INTEGER,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    group_type VARCHAR(100),
    preferred_month VARCHAR(100),
    expectations TEXT,
    status VARCHAR(50) DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'VIBE CHECK SENT', 'CONFIRMED', 'NOT A FIT')),
    owner_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS leads_trip_id_idx ON public.leads(trip_id);

-- 3. Create Notes/Call Logs Table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for notes
CREATE INDEX IF NOT EXISTS notes_lead_id_idx ON public.notes(lead_id);
