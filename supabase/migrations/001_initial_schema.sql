-- ====================================================================
-- HOME GENIE — SUPABASE DATABASE MIGRATIONS & SCHEMA
-- Complete Smart Home Management + Architecture + AI Platform
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'Asia/Kolkata',
  preferences JSONB DEFAULT '{"theme": "system", "unit": "sqft", "currency": "INR", "vastu": true, "sustainability": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. HOMES TABLE
CREATE TABLE IF NOT EXISTS homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  postal_code TEXT,
  home_type TEXT DEFAULT 'Apartment',
  description TEXT,
  plot_width NUMERIC,
  plot_length NUMERIC,
  plot_area NUMERIC,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  floor TEXT DEFAULT 'Ground Floor',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. APPLIANCES TABLE
CREATE TABLE IF NOT EXISTS appliances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_expiry DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'needs_maintenance', 'in_repair', 'inactive')),
  energy_rating TEXT DEFAULT '5-Star',
  power_consumption NUMERIC DEFAULT 150,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. APPLIANCE IMAGES TABLE
CREATE TABLE IF NOT EXISTS appliance_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appliance_id UUID NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  caption TEXT,
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. MAINTENANCE TASKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appliance_id UUID REFERENCES appliances(id) ON DELETE CASCADE,
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. AI CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Home Consultation',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. AI MESSAGES TABLE
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. AI RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID REFERENCES homes(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'Energy',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'completed', 'dismissed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. ENERGY RECORDS TABLE
CREATE TABLE IF NOT EXISTS energy_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  home_id UUID NOT NULL REFERENCES homes(id) ON DELETE CASCADE,
  appliance_id UUID REFERENCES appliances(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  energy_consumption NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kWh',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 12. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_homes_user_id ON homes(user_id);
CREATE INDEX IF NOT EXISTS idx_rooms_home_id ON rooms(home_id);
CREATE INDEX IF NOT EXISTS idx_appliances_home_id ON appliances(home_id);
CREATE INDEX IF NOT EXISTS idx_appliances_room_id ON appliances(room_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_user_id ON maintenance_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_home_id ON maintenance_tasks(home_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tasks_appliance_id ON maintenance_tasks(appliance_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_home_id ON ai_conversations(home_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_id ON ai_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_home_id ON ai_recommendations(home_id);
CREATE INDEX IF NOT EXISTS idx_energy_records_user_id ON energy_records(user_id);
CREATE INDEX IF NOT EXISTS idx_energy_records_home_id ON energy_records(home_id);
CREATE INDEX IF NOT EXISTS idx_energy_records_appliance_id ON energy_records(appliance_id);

-- 13. AUTOMATED PROFILE TRIGGER ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 14. UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_homes_modtime BEFORE UPDATE ON homes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_rooms_modtime BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_appliances_modtime BEFORE UPDATE ON appliances FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_maintenance_tasks_modtime BEFORE UPDATE ON maintenance_tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_ai_conversations_modtime BEFORE UPDATE ON ai_conversations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE appliance_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_records ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Homes Policies
CREATE POLICY "Users can view own homes" ON homes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own homes" ON homes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own homes" ON homes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own homes" ON homes FOR DELETE USING (auth.uid() = user_id);

-- Rooms Policies (Cascaded through Homes)
CREATE POLICY "Users can view own rooms" ON rooms FOR SELECT
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = rooms.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can insert own rooms" ON rooms FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM homes WHERE homes.id = rooms.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can update own rooms" ON rooms FOR UPDATE
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = rooms.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can delete own rooms" ON rooms FOR DELETE
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = rooms.home_id AND homes.user_id = auth.uid()));

-- Appliances Policies (Cascaded through Homes)
CREATE POLICY "Users can view own appliances" ON appliances FOR SELECT
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = appliances.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can insert own appliances" ON appliances FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM homes WHERE homes.id = appliances.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can update own appliances" ON appliances FOR UPDATE
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = appliances.home_id AND homes.user_id = auth.uid()));
CREATE POLICY "Users can delete own appliances" ON appliances FOR DELETE
  USING (EXISTS (SELECT 1 FROM homes WHERE homes.id = appliances.home_id AND homes.user_id = auth.uid()));

-- Appliance Images Policies
CREATE POLICY "Users can view own appliance images" ON appliance_images FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appliance images" ON appliance_images FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own appliance images" ON appliance_images FOR DELETE USING (auth.uid() = user_id);

-- Maintenance Tasks Policies
CREATE POLICY "Users can view own maintenance tasks" ON maintenance_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own maintenance tasks" ON maintenance_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenance tasks" ON maintenance_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own maintenance tasks" ON maintenance_tasks FOR DELETE USING (auth.uid() = user_id);

-- AI Conversations & Messages Policies
CREATE POLICY "Users can view own AI conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI conversations" ON ai_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own AI conversations" ON ai_conversations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own AI messages" ON ai_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI messages" ON ai_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI Recommendations Policies
CREATE POLICY "Users can view own AI recommendations" ON ai_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own AI recommendations" ON ai_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- Energy Records Policies
CREATE POLICY "Users can view own energy records" ON energy_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own energy records" ON energy_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 16. STORAGE BUCKETS (avatars, home-images, appliance-images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true),
       ('home-images', 'home-images', false),
       ('appliance-images', 'appliance-images', false)
ON CONFLICT (id) DO NOTHING;
