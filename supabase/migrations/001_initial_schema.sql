-- ==========================================
-- 育兒智多星 — 初始資料庫 Schema
-- Version: 001
-- ==========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  city TEXT,
  district TEXT,
  parenting_style TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Families
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Family members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  role TEXT NOT NULL DEFAULT 'primary_caregiver',
  permissions TEXT DEFAULT 'admin',
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- Children
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  birth_weight_g INTEGER,
  birth_height_cm DECIMAL(5,2),
  gestational_weeks INTEGER,
  allergies TEXT[] DEFAULT '{}',
  health_conditions TEXT[] DEFAULT '{}',
  special_traits TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Growth records
CREATE TABLE public.growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  recorded_by UUID REFERENCES public.profiles(id),
  measured_at DATE NOT NULL,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  head_circumference_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meal records
CREATE TABLE public.meal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  recorded_by UUID REFERENCES public.profiles(id),
  meal_date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Milestones
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  milestone_key TEXT NOT NULL,
  achieved_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Places (親子景點)
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  place_type TEXT[],
  suitable_age_min INTEGER DEFAULT 0,
  suitable_age_max INTEGER DEFAULT 144,
  is_indoor BOOLEAN DEFAULT false,
  mosquito_risk_level INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  opening_hours JSONB,
  avg_stay_minutes INTEGER,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  is_trending BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Kindergartens
CREATE TABLE public.kindergartens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  district TEXT,
  address TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  phone TEXT,
  website TEXT,
  type TEXT,
  teaching_method TEXT[],
  student_teacher_ratio DECIMAL(4,1),
  capacity INTEGER,
  monthly_fee INTEGER,
  registration_fee INTEGER,
  extended_care_fee INTEGER,
  material_fee INTEGER,
  inspection_records JSONB,
  violation_records JSONB,
  staff_turnover_rate DECIMAL(4,2),
  features JSONB,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI reports
CREATE TABLE public.ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  report_date DATE NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Place reviews
CREATE TABLE public.place_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id UUID REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  visited_with_ages INTEGER[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Kindergarten reviews
CREATE TABLE public.kindergarten_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kindergarten_id UUID REFERENCES public.kindergartens(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  child_attended_years TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- Row Level Security
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kindergarten_reviews ENABLE ROW LEVEL SECURITY;

-- Public read for places and kindergartens
CREATE POLICY "Places are viewable by everyone" ON public.places FOR SELECT USING (true);
CREATE POLICY "Kindergartens are viewable by everyone" ON public.kindergartens FOR SELECT USING (true);
CREATE POLICY "Place reviews are viewable by everyone" ON public.place_reviews FOR SELECT USING (true);
CREATE POLICY "Kindergarten reviews are viewable by everyone" ON public.kindergarten_reviews FOR SELECT USING (true);

-- Users can manage their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Families
CREATE POLICY "Family members can view families" ON public.families FOR SELECT USING (
  id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create families" ON public.families FOR INSERT WITH CHECK (created_by = auth.uid());

-- Family members
CREATE POLICY "Family members can view members" ON public.family_members FOR SELECT USING (
  family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can insert members" ON public.family_members FOR INSERT WITH CHECK (
  family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND permissions = 'admin')
  OR user_id = auth.uid()
);

-- Children
CREATE POLICY "Family members can view children" ON public.children FOR SELECT USING (
  family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
);
CREATE POLICY "Family members can insert children" ON public.children FOR INSERT WITH CHECK (
  family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND permissions IN ('admin', 'edit'))
);
CREATE POLICY "Family members can update children" ON public.children FOR UPDATE USING (
  family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND permissions IN ('admin', 'edit'))
);

-- Growth records
CREATE POLICY "Family can view growth records" ON public.growth_records FOR SELECT USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);
CREATE POLICY "Family can insert growth records" ON public.growth_records FOR INSERT WITH CHECK (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);
CREATE POLICY "Family can update growth records" ON public.growth_records FOR UPDATE USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);
CREATE POLICY "Family can delete growth records" ON public.growth_records FOR DELETE USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);

-- Meal records
CREATE POLICY "Family can view meal records" ON public.meal_records FOR SELECT USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);
CREATE POLICY "Family can insert meal records" ON public.meal_records FOR INSERT WITH CHECK (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);

-- Milestones
CREATE POLICY "Family can view milestones" ON public.milestones FOR SELECT USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);
CREATE POLICY "Family can insert milestones" ON public.milestones FOR INSERT WITH CHECK (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);

-- AI reports
CREATE POLICY "Family can view ai reports" ON public.ai_reports FOR SELECT USING (
  child_id IN (SELECT id FROM public.children WHERE family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid()))
);

-- User reviews
CREATE POLICY "Users can insert place reviews" ON public.place_reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can insert kindergarten reviews" ON public.kindergarten_reviews FOR INSERT WITH CHECK (user_id = auth.uid());

-- ==========================================
-- Helper Functions
-- ==========================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
