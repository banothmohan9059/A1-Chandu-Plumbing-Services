-- ==============================================================================
-- A1 CHANDU PLUMBING SERVICES - INITIAL DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  business_name TEXT NOT NULL DEFAULT 'A1 Chandu Plumbing Services',
  owner_name TEXT NOT NULL DEFAULT 'Chandu',
  phone TEXT NOT NULL DEFAULT '7032270517',
  whatsapp TEXT NOT NULL DEFAULT '7032270517',
  email TEXT NOT NULL DEFAULT 'chandubanoth00@gmail.com',
  working_hours TEXT DEFAULT '24/7 Emergency Service',
  tagline TEXT DEFAULT 'Professional Plumbing. Quality You Can Trust.',
  experience_years INTEGER DEFAULT 5,
  location_base TEXT DEFAULT 'Miyapur, Hyderabad, Telangana, India',
  hero_title TEXT DEFAULT 'Professional Plumbing. Exceptional Workmanship.',
  hero_description TEXT DEFAULT 'From emergency plumbing repairs to complete renovation and grouting, A1 Chandu Plumbing Services delivers dependable solutions with quality workmanship across Hyderabad.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICE AREAS (LOCALITIES IN HYDERABAD)
CREATE TABLE IF NOT EXISTS public.service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  district TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  detailed_description TEXT,
  icon_name TEXT DEFAULT 'Wrench',
  image_url TEXT,
  starting_price TEXT,
  price_range TEXT,
  time_estimate TEXT,
  warranty_period TEXT,
  badge_text TEXT,
  is_emergency BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  common_problems JSONB DEFAULT '[]'::jsonb,
  our_process JSONB DEFAULT '[]'::jsonb,
  why_choose_us JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECTS / PORTFOLIO TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  primary_image_url TEXT,
  before_image_url TEXT,
  after_image_url TEXT,
  is_before_after BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOMER REVIEWS TABLE (Zero Fake Reviews Policy)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  locality TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  service_availed TEXT,
  review_text TEXT NOT NULL,
  date_text TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMER ENQUIRIES & EMERGENCY CALLS
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  locality TEXT,
  service_needed TEXT,
  urgency TEXT DEFAULT 'Normal',
  message TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMIN ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Site Settings Policies
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update site settings"
  ON public.site_settings FOR ALL TO authenticated USING (true);

-- 2. Service Areas Policies
CREATE POLICY "Public can view enabled service areas"
  ON public.service_areas FOR SELECT USING (is_enabled = true);
CREATE POLICY "Authenticated users manage service areas"
  ON public.service_areas FOR ALL TO authenticated USING (true);

-- 3. Services Policies
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users manage services"
  ON public.services FOR ALL TO authenticated USING (true);

-- 4. FAQs Policies
CREATE POLICY "Public can view published FAQs"
  ON public.faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users manage FAQs"
  ON public.faqs FOR ALL TO authenticated USING (true);

-- 5. Projects Policies
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users manage projects"
  ON public.projects FOR ALL TO authenticated USING (true);

-- 6. Reviews Policies
CREATE POLICY "Public can view approved reviews"
  ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can submit reviews"
  ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users manage reviews"
  ON public.reviews FOR ALL TO authenticated USING (true);

-- 7. Enquiries Policies
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated admins can view and manage enquiries"
  ON public.enquiries FOR ALL TO authenticated USING (true);

-- 8. Activity Logs Policies
CREATE POLICY "Authenticated admins can view and insert activity logs"
  ON public.activity_logs FOR ALL TO authenticated USING (true);

