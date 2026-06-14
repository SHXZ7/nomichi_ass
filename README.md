# Nomichi Trip Desk — Build Assignment

Welcome to the **Nomichi Trip Desk**, a unified management workspace designed for Monday morning. This app enables travellers to submit custom enquiries on a public landing page and empowers the Nomichi team to track, qualify, and confirm traveler bookings in a bespoke mini-CRM.

---

## 🎨 Design & UX Decisions (Calm, Editorial & No Friction)
Nomichi is a slow travel brand. The tool should feel like the brand — **calm, clean, and intentional**:
* **Harmonious Warm Palette**: Used warm sand, off-white cream background (`#FFFBF5`), editorial dark ink text (`#1C1B1A`), and subtle rust-orange accents (`#D55D27`) to establish a premium travel identity.
* **Typographic Hierarchy**: Paired *Playfair Display* (Serif) for headings to retain an editorial feel, and *Poppins* (Sans-serif) for tabular views and readable metadata.
* **Custom Dropdown Badges**: Replaced default browser select boxes on the details page with custom, state-driven menus that close when clicking outside. Statuses are color-coded (e.g. `NEW` is blue, `CONFIRMED` is green, `NOT A FIT` is gray) to help sales associates prioritize their workflow at a glance.
* **Validation Experience**: Instead of invasive browser alerts, the public enquiry form checks phone lengths (at least 10 digits) and displays a modern inline warning banner, preserving the calm user flow.

---

## 🏗️ Architectural & Data Decisions

### 1. Hybrid Rendering Model (Next.js App Router)
* **Server Components**: The page shells (`app/page.js`, `/admin/dashboard`, `/admin/leads/[id]`) are Server Components. They fetch data directly from Supabase at the database layer. This ensures fast initial loading times, improves SEO, and prevents client-side loading flashes.
* **Client Components**: Interactive features (like modals, dropdown selectors, copy-to-clipboard, and textarea logs) are isolated as Client Components (`"use client"`). This maintains a clear separation of concerns.

### 2. Pragmatic Schema Structure (`supabase/schema.sql`)
* **Relational Integrity**: 
  * `leads.trip_id` references `trips.id` with `ON DELETE SET NULL`. If a trip is deleted, we preserve the lead's history (making it "Unassigned") rather than wiping out candidate traveller data.
  * `notes.lead_id` references `leads.id` with `ON DELETE CASCADE`. If a lead record is deleted, its logs and timeline are automatically cleaned up.
* **Query Optimization**: Placed database indices on `leads(trip_id)` and `notes(lead_id)` to ensure fast join execution as note volume scales.

### 3. Server-Side AI Integrations
* The AI message generator and Vibe Check checks run on edge-friendly Next.js server-side endpoints (`/api/generate-message` and `/api/vibe-check`). This keeps process secrets (`GROQ_API_KEY`) secure and out of the browser bundle.

---

## 🔮 What I Would Do With More Time (Roadmap)

### 1. Direct Twilio & WhatsApp Business API Integration
Currently, the "Send Chat" action opens a pre-filled WhatsApp link. With more time, we would integrate the official WhatsApp API. This would allow associates to send and receive WhatsApp messages **directly inside the CRM timeline**, logging conversation history automatically without leaving the page.

### 2. Automated Seat Reservation & Oversold Triggers
We would implement a database trigger:
* When a lead status updates to `CONFIRMED`, decrement the corresponding trip's `remaining_seats`.
* If a trip's `remaining_seats` reaches `0`, automatically update the trip status to `closed`, hiding it from the public enquiry form, or transition the trip to a "Waitlist" stage.

### 3. Row-Level Security (RLS) & Multi-tenant Roles
Currently, all signed-in users can view all leads. We would implement Supabase RLS policies:
* **Sales Associates** can only view and update leads where `owner_email` matches their authenticated email.
* **Admins/Team Leads** have full select and update privileges to assign owners.

### 4. Supabase Realtime Collaboration
Use Supabase Realtime subscriptions in `app/admin/leads/page.js` to broadcast status updates and new notes. If two associates are looking at the same lead, edits made by one would reflect instantly on the other's monitor without reloading.

### 5. Automated Round-Robin Lead Assignment
Create a serverless function that triggers when a new enquiry is submitted, automatically assigning the lead to an active sales associate based on their current workload and active status.

---

## 🛠️ Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 3. Initialize Database & Seed Data
Execute the following SQL files in your Supabase SQL Editor:
1. **Schema Setup**: Run [supabase/schema.sql](file:///c:/Users/HP/Desktop/nomichi/nomichi-trip-desk/supabase/schema.sql) to initialize tables and indices.
2. **Seed Data**: Run [supabase/seed.sql](file:///c:/Users/HP/Desktop/nomichi/nomichi-trip-desk/supabase/seed.sql) to seed 4 trips, 3 leads, and timeline entries.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for lead capture, and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in to the CRM.
