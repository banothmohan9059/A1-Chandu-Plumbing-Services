# A1 CHANDU PLUMBING SERVICES — HYDERABAD

> **"Professional Plumbing. Quality You Can Trust."**  
> Luxury Service-Business Website & Full SaaS Content Management Dashboard.

---

## 1. Business Information & Verified Credentials
- **Business Name:** A1 Chandu Plumbing Services
- **Owner & Lead Specialist:** Chandu (5 Years of verified field experience)
- **Primary Base:** Miyapur, Hyderabad, Telangana, India
- **Phone:** `+91 7032270517` (`tel:7032270517`)
- **WhatsApp:** `+91 7032270517` (`https://wa.me/917032270517`)
- **Email:** `chandubanoth00@gmail.com`
- **Working Hours:** 24/7 Emergency Response
- **Specializations:** Concealed Pipe Leak Detection, Luxury Bathroom Plumbing, Water Heater/Geyser Hookup, Home Renovation, and 100% Waterproof Epoxy Grouting.

---

## 2. 25 Initial Service Localities in Hyderabad
The system natively supports and dynamically manages service coverage across 25 key localities:
1. **Miyapur**
2. **Ameenpur**
3. **Beerumguda**
4. **Krishnareddypet**
5. **BHEL**
6. **Lingampally**
7. **Isnapur**
8. **Patancheru**
9. **Indresham**
10. **Gowlidoddy**
11. **TNGO's Colony**
12. **Gachibowli**
13. **Manikonda**
14. **Narsingi**
15. **Kokapet**
16. **Hafeezpet**
17. **Kondapur**
18. **Bachupally**
19. **Mallampet**
20. **JNTU**
21. **Nizampet**
22. **KPHB Colony**
23. **Kukatpally**
24. **Chandanagar**
25. **HMT Swarnapuri**

---

## 3. Technology Stack & Architecture
- **Frontend Framework:** React 19 + TypeScript + Vite
- **Routing:** React Router v7 (`react-router-dom`)
- **Design System & Styling:** Tailwind CSS with custom Midnight Teal (`#102C35`), Champagne Copper (`#C49A65`), Warm Ivory (`#F5F2EA`), and Charcoal (`#263333`) tokens.
- **Icons:** `lucide-react`
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Supabase Auth, Storage)
- **Offline / Resilient Fallback:** Automated synchronized fallback layer enabling instant local previews and offline functionality without blocking on database provisioning.

---

## 4. Folder Structure
```text
chandu-plumbing-services/
├── frontend/                    # Client Application (React 19 + TypeScript + Vite)
│   ├── public/                  # Favicon, robots.txt, sitemap
│   ├── src/
│   │   ├── components/          # Common, Home, Services, Gallery components
│   │   ├── contexts/            # AuthContext (Supabase Auth)
│   │   ├── layouts/             # PublicLayout, AdminLayout
│   │   ├── lib/                 # supabase.ts client, initialData.ts
│   │   ├── pages/               # Public & Admin pages
│   │   ├── services/            # api.ts (Unified data & storage operations)
│   │   └── types/               # TypeScript interfaces & models
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env.example
├── backend/                     # Backend Configuration & Database
│   ├── supabase/
│   │   └── migrations/
│   │       ├── 001_initial_schema.sql # RLS policies, tables, indexes
│   │       └── 002_seed_data.sql     # 25 localities, 14 services, verified info
│   └── README.md                # Backend setup guide
└── README.md
```

---

## 5. Local Development Quickstart

1. **Enter the frontend directory:**
   ```bash
   cd "chandu plumbing services/frontend"
   ```

2. **Install dependencies (already installed in frontend/):**
   ```bash
   npm install
   ```

3. **Start local Vite development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` (or `http://localhost:5174/`).

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 6. Supabase Setup & Database Provisioning

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Run `supabase/migrations/001_initial_schema.sql` to generate tables and secure Row Level Security (RLS) policies.
4. Run `supabase/migrations/002_seed_data.sql` to populate:
   - Verified site settings
   - 25 Hyderabad service localities
   - 14 complete services with common problems, processes, and FAQs
   - Initial portfolio items
5. Go to **Storage** and create two public buckets:
   - `projects` (for portfolio images)
   - `enquiry-attachments` (for customer leak photos)
6. Copy your project credentials into `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 7. Admin Dashboard Access & Provisioning
- **Admin URL:** `/admin` or `/admin/login`
- **Default Owner Credentials:**
  - **Email:** `chandubanoth00@gmail.com`
  - **Password:** `chandu@70322` (or phone number `7032270517`)
- To create a live Supabase Auth account:
  1. Open your Supabase Dashboard -> **Authentication** -> **Users**.
  2. Click **Add User** -> **Create User**.
  3. Enter Chandu's email (`chandubanoth00@gmail.com`) and set a strong password.

---

## 8. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Log into [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Import the repository.
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (e.g. `https://a1chanduplumbing.com`)
5. Click **Deploy**. Vercel will automatically build using `npm run build` with output directory `dist/`.

---

## 9. Domain Connection Instructions
1. In your Vercel project dashboard, navigate to **Settings** -> **Domains**.
2. Enter your custom domain (e.g., `a1chanduplumbing.com`).
3. Add the recommended DNS records at your domain registrar (GoDaddy, Namecheap, Hostinger, etc.):
   - `A` Record: `@` -> `76.76.21.21`
   - `CNAME` Record: `www` -> `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically by Vercel within minutes.

---

## 10. Security & Quality Guarantee
- **Strict Row Level Security (RLS):** Public visitors can only read published services, enabled service areas, and approved reviews, and submit enquiries. Customer private phone numbers and internal work notes are strictly accessible only by authenticated administrators.
- **Zero Fake Claims Policy:** Reviews and statistics are 100% genuine; no manufactured counts or fabricated reviews are shown.
- **Indian Phone Sanitization & Validation:** Ensures only valid 10-digit mobile numbers are accepted.
- **Direct Technical Responsibility:** All plumbing inquiries route directly to Chandu (`7032270517`).
