-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  has_completed_onboarding BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pigs
CREATE TABLE IF NOT EXISTS public.pigs (
  id TEXT PRIMARY KEY,
  tag_id TEXT NOT NULL UNIQUE,
  breed TEXT NOT NULL,
  dob DATE NOT NULL,
  gender TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  pen_location TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  last_checkup DATE,
  image_url TEXT,
  notes TEXT,
  sire_id TEXT,
  dam_id TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  last_fed TEXT,
  nursing_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  due_date DATE NOT NULL,
  assigned_to TEXT,
  description TEXT,
  related_entity_id TEXT,
  checklist JSONB DEFAULT '[]'::jsonb,
  verification_method TEXT,
  target_qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- FeedInventory
CREATE TABLE IF NOT EXISTS public.feed_inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  reorder_level NUMERIC NOT NULL,
  last_restock TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Finance Records
CREATE TABLE IF NOT EXISTS public.finance_records (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  batch_id TEXT,
  status TEXT,
  enterprise TEXT,
  allocation_id TEXT,
  currency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BudgetRecord
CREATE TABLE IF NOT EXISTS public.budgets (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  period TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- LoanRecord
CREATE TABLE IF NOT EXISTS public.loans (
  id TEXT PRIMARY KEY,
  lender TEXT NOT NULL,
  principal NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  term_months INTEGER NOT NULL,
  balance NUMERIC NOT NULL,
  monthly_payment NUMERIC NOT NULL,
  next_payment_date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- HealthRecord
CREATE TABLE IF NOT EXISTS public.health_records (
  id TEXT PRIMARY KEY,
  pig_id TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  medication TEXT,
  administered_by TEXT NOT NULL,
  medical_item_id TEXT,
  quantity_used NUMERIC,
  cause_of_death TEXT,
  temperature NUMERIC,
  body_condition_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Fields
CREATE TABLE IF NOT EXISTS public.fields (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size NUMERIC NOT NULL,
  location TEXT,
  soil_type TEXT,
  status TEXT NOT NULL,
  current_crop_id TEXT,
  satellite_scans JSONB DEFAULT '[]'::jsonb,
  last_ndvi NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crops
CREATE TABLE IF NOT EXISTS public.crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  variety TEXT NOT NULL,
  type TEXT NOT NULL,
  days_to_maturity INTEGER NOT NULL,
  expected_yield_per_ha NUMERIC NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crop Cycles
CREATE TABLE IF NOT EXISTS public.crop_cycles (
  id TEXT PRIMARY KEY,
  field_id TEXT,
  crop_id TEXT,
  planting_date DATE NOT NULL,
  expected_harvest_date DATE NOT NULL,
  status TEXT NOT NULL,
  harvest_date DATE,
  yield_amount NUMERIC,
  yield_quality TEXT,
  destination TEXT,
  feed_type_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Assets (Machinery)
CREATE TABLE IF NOT EXISTS public.assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  purchase_date DATE NOT NULL,
  value NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Medical Items
CREATE TABLE IF NOT EXISTS public.medical_inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  cost_per_unit NUMERIC NOT NULL,
  expiry_date DATE,
  batch_number TEXT,
  supplier TEXT,
  min_stock_level NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT,
  address TEXT,
  balance NUMERIC NOT NULL,
  credit_limit NUMERIC,
  last_order_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL,
  delivery_date DATE,
  notes TEXT,
  invoice_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  customer_id TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  total_amount NUMERIC NOT NULL,
  paid_amount NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Attendance Logs
CREATE TABLE IF NOT EXISTS public.attendance_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  date DATE NOT NULL,
  check_in_time TEXT NOT NULL,
  check_out_time TEXT,
  location JSONB,
  status TEXT NOT NULL,
  method TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Visitor Logs
CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  contact TEXT NOT NULL,
  purpose TEXT NOT NULL,
  check_in_time TEXT NOT NULL,
  check_out_time TEXT,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  visited_other_farm BOOLEAN NOT NULL,
  sanitized BOOLEAN NOT NULL,
  risk_level TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Protocols
CREATE TABLE IF NOT EXISTS public.protocols (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_event TEXT,
  templates JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Knowledge Docs
CREATE TABLE IF NOT EXISTS public.knowledge_docs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT NOT NULL,
  upload_date DATE NOT NULL,
  added_by TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Enablement & Public Access (for simplicity during migration)
-- Real world apps Should securely scope to auth.uid()

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public full access profile" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access pigs" ON pigs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access feed_inventory" ON feed_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access finance_records" ON finance_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access budgets" ON budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access loans" ON loans FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access health_records" ON health_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access fields" ON fields FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access crops" ON crops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access crop_cycles" ON crop_cycles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access assets" ON assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access medical_inventory" ON medical_inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access attendance_logs" ON attendance_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access visitor_logs" ON visitor_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access protocols" ON protocols FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access knowledge_docs" ON knowledge_docs FOR ALL USING (true) WITH CHECK (true);
