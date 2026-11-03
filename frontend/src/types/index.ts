export interface SiteSettings {
  id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  working_hours: string;
  tagline: string;
  experience_years: number;
  location_base: string;
  hero_title: string;
  hero_description: string;
  updated_at?: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  district: string;
  is_enabled: boolean;
  display_order: number;
  popular: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  image_url: string;
  is_featured: boolean;
  is_emergency?: boolean;
  is_published: boolean;
  display_order: number;
  common_problems?: string[];
  what_included?: string[];
  benefits?: string[];
  work_process?: string[];
  faqs?: ServiceFAQ[];
  seo_title?: string;
  seo_meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  primary_image_url: string;
  before_image_url?: string | null;
  after_image_url?: string | null;
  is_before_after: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id: string;
  customer_name: string;
  locality: string;
  service_taken?: string;
  rating: number;
  review_text: string;
  review_date?: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Enquiry {
  id?: string;
  customer_name: string;
  phone: string;
  service_id?: string | null;
  service_name?: string | null;
  locality_id?: string | null;
  locality_name?: string | null;
  other_locality?: string | null;
  problem_description?: string | null;
  attachment_url?: string | null;
  privacy_consent?: boolean;
  status?: string;
  internal_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  role?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}
