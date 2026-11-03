# Backend (Supabase)

This directory contains the database migrations, schemas, seed data, and backend storage configurations for **A1 Chandu Plumbing Services**.

## Structure

```text
backend/
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql  # Database tables, RLS policies, indexes
        └── 002_seed_data.sql       # 25 Hyderabad localities, 14 services, FAQs, portfolio
```

## Setup Instructions

1. **SQL Migrations:**
   - Go to your Supabase project dashboard -> **SQL Editor**.
   - Run `001_initial_schema.sql` to establish tables and Row Level Security (RLS) policies.
   - Run `002_seed_data.sql` to insert the initial site data.

2. **Storage Buckets:**
   - In Supabase -> **Storage**, ensure the following two public buckets are created:
     - `projects` (for portfolio project photos)
     - `enquiry-attachments` (for customer leak / issue photos)

3. **Admin User:**
   - In Supabase -> **Authentication** -> **Users**, add the admin user:
     - **Email:** `chandubanoth00@gmail.com`

