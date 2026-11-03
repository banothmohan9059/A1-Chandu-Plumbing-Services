import { supabase } from '../lib/supabase';
import type {
  SiteSettings,
  ServiceArea,
  Service,
  Project,
  Review,
  FAQ,
  Enquiry,
} from '../types';

export const api = {
  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'primary')
      .single();
    if (error) {
      console.error('Error fetching site settings:', error);
      return null;
    }
    return data;
  },

  // Services
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) {
      console.error('Error fetching services:', error);
      return [];
    }
    return data || [];
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) {
      console.error('Error fetching service:', error);
      return null;
    }
    return data;
  },

  // Service Areas
  async getServiceAreas(): Promise<ServiceArea[]> {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .eq('is_enabled', true)
      .order('display_order', { ascending: true });
    if (error) {
      console.error('Error fetching service areas:', error);
      return [];
    }
    return data || [];
  },

  // Projects / Portfolio
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
    return data || [];
  },

  async submitReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    const { error } = await supabase.from('reviews').insert([review]);
    if (error) {
      console.error('Error submitting review:', error);
      return false;
    }
    return true;
  },

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });
    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
    return data || [];
  },

  // Enquiries
  async submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    const { error } = await supabase.from('enquiries').insert([
      {
        ...enquiry,
        status: enquiry.status || 'New',
        problem_description: enquiry.problem_description?.trim() || 'Plumbing Service Request',
      },
    ]);
    if (error) {
      console.error('Error submitting enquiry:', error);
      return false;
    }
    return true;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching enquiries:', error);
      return [];
    }
    return data || [];
  },

  async updateEnquiryStatus(id: string, status: string): Promise<boolean> {
    const { error } = await supabase
      .from('enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error updating enquiry status:', error);
      return false;
    }
    return true;
  },

  // Storage Uploads
  async uploadAttachment(
    file: File,
    bucket: 'projects' | 'enquiry-attachments' = 'enquiry-attachments'
  ): Promise<string | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  },
};
