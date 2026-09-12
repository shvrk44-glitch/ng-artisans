-- ========================================================================
-- NG-ARTISANS: HARDENED SUPABASE PRODUCTION DATABASE SCHEMA
-- Features:
-- 1. Idempotent (safe to re-run multiple times without 42710 policy errors)
-- 2. Strict Check Constraints on ratings, statuses, and categories
-- 3. Hardened Row Level Security (RLS) with least-privilege policies
-- 4. Column-Level Grant Protection against tampering with verification/ratings
-- ========================================================================

-- Enable UUID extension if needed in future
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================================
-- 1. TABLE DEFINITIONS WITH CONSTRAINTS
-- ========================================================================

-- 1.1 ARTISANS TABLE
CREATE TABLE IF NOT EXISTS public.artisans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    avatar TEXT,
    profession TEXT NOT NULL CHECK (profession IN ('plumbing', 'electrical', 'construction')),
    profession_label TEXT NOT NULL,
    sub_services JSONB DEFAULT '[]'::jsonb,
    location JSONB NOT NULL,
    service_areas JSONB DEFAULT '[]'::jsonb,
    max_travel_radius_km NUMERIC DEFAULT 25 CHECK (max_travel_radius_km >= 1 AND max_travel_radius_km <= 150),
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    verification_details JSONB DEFAULT '{"idVerified": false, "phoneVerified": true, "tradeCertVerified": false}'::jsonb,
    rating NUMERIC DEFAULT 5.0 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    completed_jobs_count INT DEFAULT 0 CHECK (completed_jobs_count >= 0),
    years_of_experience INT DEFAULT 1 CHECK (years_of_experience >= 0 AND years_of_experience <= 60),
    phone TEXT NOT NULL,
    whatsapp TEXT,
    bio TEXT,
    portfolio_images JSONB DEFAULT '[]'::jsonb,
    pricing_guidance TEXT,
    languages JSONB DEFAULT '["English"]'::jsonb,
    working_hours TEXT DEFAULT 'Mon - Sat: 8:00 AM - 6:00 PM',
    is_urgent_accepting BOOLEAN DEFAULT true,
    availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
    response_time_text TEXT DEFAULT 'Responds within 30 mins',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 CUSTOMER JOB REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.customer_job_requests (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('plumbing', 'electrical', 'construction')),
    sub_service TEXT NOT NULL,
    description TEXT NOT NULL,
    location JSONB NOT NULL,
    urgency TEXT NOT NULL DEFAULT 'today' CHECK (urgency IN ('urgent', 'today', 'tomorrow', 'flexible')),
    photo_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'contacted', 'accepted', 'declined', 'completed')),
    assigned_artisan_id TEXT REFERENCES public.artisans(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    artisan_id TEXT REFERENCES public.artisans(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_location TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date TEXT NOT NULL,
    service_name TEXT NOT NULL,
    comment TEXT NOT NULL CHECK (length(comment) >= 3),
    job_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 CONSTRUCTION PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.construction_projects (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    project_type TEXT NOT NULL,
    location JSONB NOT NULL,
    description TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    timeline TEXT NOT NULL,
    required_trades JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'connecting', 'active', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ========================================================================

ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- 3. IDEMPOTENT RLS POLICIES (DROP IF EXISTS -> CREATE)
-- ========================================================================

-- 3.1 ARTISANS POLICIES
DROP POLICY IF EXISTS "Public read artisans" ON public.artisans;
CREATE POLICY "Public read artisans" ON public.artisans
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public insert artisan registrations" ON public.artisans;
-- Security: An applicant can only register with 'pending' verification and cannot forge 'verified' or 'featured'
CREATE POLICY "Public insert artisan registrations" ON public.artisans
    FOR INSERT
    WITH CHECK (
        verification_status = 'pending'
        AND (featured IS FALSE OR featured IS NULL)
        AND completed_jobs_count = 0
    );

DROP POLICY IF EXISTS "Public update artisan status" ON public.artisans;
DROP POLICY IF EXISTS "Public update artisan availability" ON public.artisans;
-- Security: Artisans can toggle their live availability & urgency status
CREATE POLICY "Public update artisan availability" ON public.artisans
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 3.2 CUSTOMER JOB REQUESTS POLICIES
DROP POLICY IF EXISTS "Public read job requests" ON public.customer_job_requests;
CREATE POLICY "Public read job requests" ON public.customer_job_requests
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public submit job requests" ON public.customer_job_requests;
-- Security: Incoming customer jobs must always start in 'pending' status
CREATE POLICY "Public submit job requests" ON public.customer_job_requests
    FOR INSERT
    WITH CHECK (
        status = 'pending'
    );

DROP POLICY IF EXISTS "Public update job requests" ON public.customer_job_requests;
-- Security: Allow updating lead status (accepted / declined / completed)
CREATE POLICY "Public update job requests" ON public.customer_job_requests
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- 3.3 REVIEWS POLICIES
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews" ON public.reviews
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public submit reviews" ON public.reviews;
-- Security: Reviews must have a valid rating (1-5) and non-empty comment
CREATE POLICY "Public submit reviews" ON public.reviews
    FOR INSERT
    WITH CHECK (
        rating >= 1 AND rating <= 5
        AND length(trim(comment)) >= 3
    );

-- Notice: Reviews cannot be updated or deleted by public anon users (immutability)
DROP POLICY IF EXISTS "Public update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public delete reviews" ON public.reviews;

-- 3.4 CONSTRUCTION PROJECTS POLICIES
DROP POLICY IF EXISTS "Public read projects" ON public.construction_projects;
CREATE POLICY "Public read projects" ON public.construction_projects
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public submit projects" ON public.construction_projects;
CREATE POLICY "Public submit projects" ON public.construction_projects
    FOR INSERT
    WITH CHECK (
        status = 'planning'
    );

-- ========================================================================
-- 4. LEAST-PRIVILEGE PERMISSIONS (GRANTS)
-- Column-level security protects sensitive artisan fields from being overwritten
-- ========================================================================

-- Schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Table read & insert grants
GRANT SELECT, INSERT ON public.customer_job_requests TO anon, authenticated;
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT SELECT, INSERT ON public.construction_projects TO anon, authenticated;
GRANT SELECT, INSERT ON public.artisans TO anon, authenticated;

-- Secure Column-Level UPDATE grants:
-- Public anon users CANNOT alter verification_status, rating, review_count, or phone numbers.
-- They can ONLY update availability and urgent status:
GRANT UPDATE (availability, is_urgent_accepting) ON public.artisans TO anon, authenticated;
GRANT UPDATE (status) ON public.customer_job_requests TO anon, authenticated;

-- ========================================================================
-- 5. SEED INITIAL VERIFIED ARTISANS (ABUJA, LAGOS, PORT HARCOURT)
-- ========================================================================

INSERT INTO public.artisans (
    id, name, business_name, avatar, profession, profession_label,
    sub_services, location, service_areas, max_travel_radius_km,
    verification_status, verification_details, rating, review_count,
    completed_jobs_count, years_of_experience, phone, whatsapp,
    bio, portfolio_images, pricing_guidance, languages,
    working_hours, is_urgent_accepting, availability, response_time_text, featured
) VALUES
(
    'art-1',
    'Musa Danladi',
    'Apex Hydro Solutions & Plumbing',
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    'plumbing',
    'Master Plumber & Pipefitter',
    '["Burst Pipe Repairs", "Bathroom & Toilet Fitting", "Water Tank & Pump Installation", "Drain Unclogging", "Water Heater Repair"]'::jsonb,
    '{"city": "Abuja (FCT)", "neighborhood": "Wuse 2", "address": "Plot 412 Aminu Kano Crescent"}'::jsonb,
    '["Wuse 2", "Maitama", "Gwarinpa", "Utako", "Jabi", "Asokoro"]'::jsonb,
    30,
    'verified',
    '{"idVerified": true, "phoneVerified": true, "tradeCertVerified": true, "verifiedDate": "Jan 2024", "notes": "Govt Technical College Certified (NABTEB)"}'::jsonb,
    4.9, 42, 185, 11,
    '0802 345 8891', '0802 345 8891',
    'Over 11 years solving complex domestic and commercial plumbing challenges in Abuja. Specialized in PPR pipe fusion, borehole surface pump connections, pressure balancing, and emergency drain interventions.',
    '["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '₦5,000 inspection fee (deducted from total job bill). Fixed transparent billing.',
    '["English", "Hausa", "Pidgin"]'::jsonb,
    'Mon - Sun: 7:00 AM - 9:00 PM (Emergency 24/7)',
    true, 'available', 'Responds in ~15 mins', true
),
(
    'art-2',
    'Emmanuel Okafor',
    'VoltTech Electrical & Solar Power',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'electrical',
    'Certified Industrial & Domestic Electrician',
    '["House Wiring (Conduit & Surface)", "Distribution Board & Breakers", "Solar & Inverter Setup", "Generator ATS Changeover", "Short Circuit Troubleshooting"]'::jsonb,
    '{"city": "Abuja (FCT)", "neighborhood": "Gwarinpa", "address": "3rd Avenue Estate Road"}'::jsonb,
    '["Gwarinpa", "Wuse", "Kubwa", "Dawaki", "Lokogoma", "Lugbe"]'::jsonb,
    35,
    'verified',
    '{"idVerified": true, "phoneVerified": true, "tradeCertVerified": true, "verifiedDate": "Mar 2024", "notes": "NEMSA Certified Inspectorate Standard"}'::jsonb,
    4.8, 37, 142, 9,
    '0803 762 1190', '0803 762 1190',
    'Certified electrician with deep expertise in residential wiring, generator-inverter synchronized changeovers, surge suppression, and fault diagnosis.',
    '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '₦6,000 fault tracing assessment. Written quotes for solar wiring and ATS panels.',
    '["English", "Igbo", "Pidgin"]'::jsonb,
    'Mon - Sat: 8:00 AM - 7:00 PM',
    true, 'available', 'Responds in ~20 mins', true
),
(
    'art-3',
    'Sunday Adewale',
    'BuildCraft Finishers & Masonry',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'construction',
    'Master Mason, Tiler & POP Specialist',
    '["Wall & Floor Tiling", "POP Ceiling Design & Repair", "Bricklaying & Plastering", "Waterproofing & Screeding", "Painting & Wall Finishes"]'::jsonb,
    '{"city": "Abuja (FCT)", "neighborhood": "Maitama", "address": "Aguiyi Ironsi Way"}'::jsonb,
    '["Maitama", "Asokoro", "Central Area", "Guzape", "Jabi", "Airport Road"]'::jsonb,
    40,
    'verified',
    '{"idVerified": true, "phoneVerified": true, "tradeCertVerified": true, "verifiedDate": "Nov 2023", "notes": "Federal Ministry of Works Craftsmanship Registered"}'::jsonb,
    4.9, 53, 210, 14,
    '0818 902 4432', '0818 902 4432',
    'Fourteen years executing premium finishing for residential duplexes, offices, and estate renovations. Zero hollow tiles guarantee with laser leveling.',
    '["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"]'::jsonb,
    '₦1,200 - ₦2,200 per square meter depending on tile format and surface prep.',
    '["English", "Yoruba", "Pidgin"]'::jsonb,
    'Mon - Sat: 7:30 AM - 6:30 PM',
    false, 'available', 'Responds in ~30 mins', true
)
ON CONFLICT (id) DO NOTHING;

-- 5.2 SEED INITIAL REVIEWS
INSERT INTO public.reviews (
    id, artisan_id, customer_name, customer_location, rating, date, service_name, comment, job_verified
) VALUES
(
    'rev-1', 'art-1', 'Amina Bello', 'Wuse 2, Abuja', 5, '3 days ago',
    'Bathroom pipe leak repair',
    'Musa arrived within 35 minutes of my call. He identified the burst PPR pipe under the washbasin and replaced the connector cleanly without breaking wall tiles unnecessarily. Fair pricing.',
    true
),
(
    'rev-2', 'art-1', 'Chidi Okafor', 'Gwarinpa Estate, Abuja', 5, '2 weeks ago',
    'Overhead water tank & float switch installation',
    'Excellent work installing our 2000L tank and automatic float switch. No more water overflow. Clean and courteous.',
    true
),
(
    'rev-3', 'art-2', 'Engr. Babatunde Lawal', 'Utako, Abuja', 5, '1 week ago',
    'Generator ATS changeover & conduit wiring',
    'Emmanuel is thorough with load calculations and earthing. Resolved persistent circuit breaker tripping that two other electricians could not diagnose.',
    true
),
(
    'rev-4', 'art-3', 'Grace Nwachukwu', 'Maitama, Abuja', 5, '5 days ago',
    'Floor tiling (60x60 porcelain) & POP repair',
    'Sunday and his team tiled our living room and master bedroom. Perfect leveling, laser alignment, and zero hollow sound. Done within agreed timeline.',
    true
)
ON CONFLICT (id) DO NOTHING;
