-- ====================================================================
-- DriveTogether - Production Database Schema & Row Level Security (RLS)
-- Group-buying platform for serious vehicle buyers
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT,
    city TEXT DEFAULT 'Mangalore',
    area TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'dealer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Vehicle Categories Table
CREATE TABLE IF NOT EXISTS public.vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    membership_fee NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Vehicle Brands Table
CREATE TABLE IF NOT EXISTS public.vehicle_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.vehicle_brands(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES public.vehicle_categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric')),
    description TEXT,
    starting_price NUMERIC(12, 2) NOT NULL,
    image_url TEXT NOT NULL,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Vehicle Variants Table
CREATE TABLE IF NOT EXISTS public.vehicle_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    ex_showroom_price NUMERIC(12, 2) NOT NULL,
    on_road_estimate NUMERIC(12, 2) NOT NULL,
    specifications JSONB DEFAULT '{}'::jsonb,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    location TEXT NOT NULL,
    minimum_members INTEGER NOT NULL DEFAULT 50,
    current_members INTEGER NOT NULL DEFAULT 0,
    membership_fee NUMERIC(10, 2) NOT NULL,
    cycle_number INTEGER NOT NULL DEFAULT 1 CHECK (cycle_number BETWEEN 1 AND 3),
    cycle_start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    cycle_end_date TIMESTAMPTZ NOT NULL,
    maximum_cycles INTEGER NOT NULL DEFAULT 3,
    status TEXT NOT NULL DEFAULT 'Building' CHECK (
        status IN (
            'Building',
            'Almost Full',
            'Negotiation Ready',
            'Negotiating',
            'Offer Received',
            'Purchase Window Open',
            'Completed',
            'Failed',
            'Refund Processing',
            'Refunded'
        )
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Group Cycles Table (Tracks history across the 3 months)
CREATE TABLE IF NOT EXISTS public.group_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    cycle_number INTEGER NOT NULL CHECK (cycle_number BETWEEN 1 AND 3),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 0,
    minimum_members INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'carried_forward', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'successful', 'failed', 'refunded', 'refund_pending')
    ),
    payment_provider TEXT NOT NULL DEFAULT 'demo' CHECK (payment_provider IN ('demo', 'razorpay', 'cashfree')),
    transaction_reference TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Group Members Table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    membership_status TEXT NOT NULL DEFAULT 'active' CHECK (
        membership_status IN (
            'active',
            'transferred',
            'negotiation',
            'completed',
            'cancelled',
            'refund_pending',
            'refunded'
        )
    ),
    purchase_timeline TEXT NOT NULL CHECK (
        purchase_timeline IN ('Within 15 days', '15–30 days', '1–3 months', '3+ months')
    ),
    preferred_variant TEXT,
    preferred_color TEXT,
    preferred_location TEXT,
    UNIQUE(group_id, user_id)
);

-- 10. Dealers Table
CREATE TABLE IF NOT EXISTS public.dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    brands TEXT[] NOT NULL DEFAULT '{}',
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Dealer Offers Table
CREATE TABLE IF NOT EXISTS public.dealer_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
    vehicle_variant_id UUID REFERENCES public.vehicle_variants(id) ON DELETE SET NULL,
    offer_price NUMERIC(12, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL,
    offer_expiry TIMESTAMPTZ NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Refunds Table
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'refunded', 'failed')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- Column Updates (ensures existing tables get new fields safely)
-- ====================================================================
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS colors JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS preferred_color TEXT;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS selected_month TEXT;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS selected_showroom TEXT;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS showroom_id UUID;
ALTER TABLE public.dealers ADD COLUMN IF NOT EXISTS brand TEXT;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by owner and admin" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner and admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Public Read for Catalog Data
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.vehicle_categories;
CREATE POLICY "Categories viewable by everyone" ON public.vehicle_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Brands viewable by everyone" ON public.vehicle_brands;
CREATE POLICY "Brands viewable by everyone" ON public.vehicle_brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vehicles viewable by everyone" ON public.vehicles;
CREATE POLICY "Vehicles viewable by everyone" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vehicle variants viewable by everyone" ON public.vehicle_variants;
CREATE POLICY "Vehicle variants viewable by everyone" ON public.vehicle_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Groups viewable by everyone" ON public.groups;
CREATE POLICY "Groups viewable by everyone" ON public.groups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Group cycles viewable by everyone" ON public.group_cycles;
CREATE POLICY "Group cycles viewable by everyone" ON public.group_cycles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dealers viewable by everyone" ON public.dealers;
CREATE POLICY "Dealers viewable by everyone" ON public.dealers FOR SELECT USING (true);

-- Group Members Policies
DROP POLICY IF EXISTS "Members can view their own memberships" ON public.group_members;
CREATE POLICY "Members can view their own memberships"
    ON public.group_members FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Payments Policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Dealer Offers Policies
DROP POLICY IF EXISTS "Users can view offers for groups they joined" ON public.dealer_offers;
CREATE POLICY "Users can view offers for groups they joined"
    ON public.dealer_offers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = dealer_offers.group_id
            AND group_members.user_id = auth.uid()
        ) OR public.is_admin()
    );

-- Refunds Policies
DROP POLICY IF EXISTS "Users can view their own refunds" ON public.refunds;
CREATE POLICY "Users can view their own refunds"
    ON public.refunds FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark their own notifications as read" ON public.notifications;
CREATE POLICY "Users can mark their own notifications as read"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin Full Access Policies
DROP POLICY IF EXISTS "Admin full access on categories" ON public.vehicle_categories;
CREATE POLICY "Admin full access on categories" ON public.vehicle_categories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on brands" ON public.vehicle_brands;
CREATE POLICY "Admin full access on brands" ON public.vehicle_brands FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on vehicles" ON public.vehicles;
CREATE POLICY "Admin full access on vehicles" ON public.vehicles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on variants" ON public.vehicle_variants;
CREATE POLICY "Admin full access on variants" ON public.vehicle_variants FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on groups" ON public.groups;
CREATE POLICY "Admin full access on groups" ON public.groups FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on group_cycles" ON public.group_cycles;
CREATE POLICY "Admin full access on group_cycles" ON public.group_cycles FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on group_members" ON public.group_members;
CREATE POLICY "Admin full access on group_members" ON public.group_members FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on payments" ON public.payments;
CREATE POLICY "Admin full access on payments" ON public.payments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on dealers" ON public.dealers;
CREATE POLICY "Admin full access on dealers" ON public.dealers FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on dealer_offers" ON public.dealer_offers;
CREATE POLICY "Admin full access on dealer_offers" ON public.dealer_offers FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on refunds" ON public.refunds;
CREATE POLICY "Admin full access on refunds" ON public.refunds FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on notifications" ON public.notifications;
CREATE POLICY "Admin full access on notifications" ON public.notifications FOR ALL USING (public.is_admin());
