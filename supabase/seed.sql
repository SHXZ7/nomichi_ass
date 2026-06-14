-- Seed Data for Nomichi Trip Desk
-- Execute this script in your Supabase SQL Editor to seed the database with initial routes and leads.

-- 1. Insert Curated Trips
INSERT INTO public.trips (id, name, destination, start_date, end_date, price, total_seats, status, description)
VALUES 
  ('1b6f39b2-5568-42d8-b8a6-584cc480fca1', 'Spiti Slow Circuit', 'Spiti Valley, Himachal Pradesh', '2026-07-12', '2026-07-21', 58000, 12, 'open', 'Ten quiet days across the cold desert. Monastery mornings, river-bend lunches, and a long stretch of nothing but sky.'),
  ('1b6f39b2-5568-42d8-b8a6-584cc480fca2', 'Ladakh Pangong Slow Lap', 'Leh, Nubra and Pangong', '2026-08-09', '2026-08-18', 72000, 8, 'open', 'A small group, two acclimatisation days, and a route built for breath. Cold lakes, warm tea, slow drives.'),
  ('1b6f39b2-5568-42d8-b8a6-584cc480fca3', 'Meghalaya Living Roots', 'Cherrapunjee and Nongriat', '2026-09-05', '2026-09-11', 42000, 12, 'open', 'Seven days of rain, root bridges and Khasi kitchens. Walks that ask for patience, evenings that ask for none.'),
  ('1b6f39b2-5568-42d8-b8a6-584cc480fca4', 'Rajasthan Desert Whispers', 'Jaisalmer, Rajasthan', '2026-10-15', '2026-10-21', 35000, 10, 'closed', 'A heritage route tracing desert paths, night sky camping, and local musicians playing in sandstone homes.');

-- 2. Insert Sample Leads/Enquiries
INSERT INTO public.leads (id, name, phone, email, trip_id, group_type, preferred_month, expectations, status, owner_email)
VALUES 
  ('584cc480-5568-42d8-b8a6-584cc480fca1', 'Ananya Rao', '+91 98765 43210', 'ananya.rao@gmail.com', '1b6f39b2-5568-42d8-b8a6-584cc480fca1', 'Couple', 'July', 'Hoping to disconnect completely from screens, spend morning hours in quiet cafes and monasteries.', 'CONTACTED', 'tech@thenomichi.com'),
  ('584cc480-5568-42d8-b8a6-584cc480fca2', 'Vikram Malhotra', '+91 87654 32109', 'vikram.malhotra@yahoo.com', '1b6f39b2-5568-42d8-b8a6-584cc480fca3', 'Solo', 'September', 'I want a trip with no tourist crowds. Ready for long walks in the rain.', 'NEW', NULL),
  ('584cc480-5568-42d8-b8a6-584cc480fca3', 'Zara Sen', '+91 76543 21098', 'zara.sen@outlook.com', '1b6f39b2-5568-42d8-b8a6-584cc480fca2', 'Friends', 'August', 'Four of us are planning this trip together to celebrate graduation. Looking for cold mountains and starry nights.', 'CONFIRMED', 'tech@thenomichi.com');

-- 3. Insert Call Logs / Notes
INSERT INTO public.notes (id, lead_id, content, created_at)
VALUES 
  (gen_random_uuid(), '584cc480-5568-42d8-b8a6-584cc480fca1', 'Spoke to Ananya. She is extremely excited about the Spiti Valley route. Reassured her about high altitude acclimatisation.', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), '584cc480-5568-42d8-b8a6-584cc480fca1', 'Sent first response mail with Spiti PDF details.', NOW() - INTERVAL '1 day 2 hours'),
  (gen_random_uuid(), '584cc480-5568-42d8-b8a6-584cc480fca3', 'Seat booked. Deposit received. Sent booking confirmation for Ladakh.', NOW() - INTERVAL '2 days');
