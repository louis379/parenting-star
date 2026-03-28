-- =============================================
-- 育兒智多星 — 資料庫初始化 Migration
-- 請在 Supabase Dashboard → SQL Editor 中執行
-- =============================================

-- 1. families
CREATE TABLE IF NOT EXISTS public.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. family_members
CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'primary',
  permissions text,
  joined_at timestamptz NOT NULL DEFAULT now()
);

-- 3. children
CREATE TABLE IF NOT EXISTS public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  birth_date date NOT NULL,
  gender text,
  birth_weight_g numeric,
  birth_height_cm numeric,
  gestational_weeks integer,
  allergies text[] NOT NULL DEFAULT '{}',
  health_conditions text[] NOT NULL DEFAULT '{}',
  special_traits text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. growth_records
CREATE TABLE IF NOT EXISTS public.growth_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  measured_at date NOT NULL,
  height_cm numeric,
  weight_kg numeric,
  head_circumference_cm numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. meal_records
CREATE TABLE IF NOT EXISTS public.meal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  meal_date date NOT NULL,
  meal_type text NOT NULL,
  description text,
  photo_url text,
  ai_analysis jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  category text NOT NULL,
  milestone_key text NOT NULL,
  achieved_at date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. places (optional — app has mock data fallback)
CREATE TABLE IF NOT EXISTS public.places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  district text,
  address text,
  lat numeric,
  lng numeric,
  place_type text[],
  suitable_age_min integer NOT NULL DEFAULT 0,
  suitable_age_max integer NOT NULL DEFAULT 144,
  is_indoor boolean NOT NULL DEFAULT false,
  mosquito_risk_level integer NOT NULL DEFAULT 1,
  features text[] NOT NULL DEFAULT '{}',
  opening_hours jsonb,
  avg_stay_minutes integer,
  avg_rating numeric NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  image_url text,
  description text,
  is_trending boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 8. kindergartens (optional — app has mock data fallback)
CREATE TABLE IF NOT EXISTS public.kindergartens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  district text,
  address text,
  lat numeric,
  lng numeric,
  phone text,
  website text,
  type text,
  teaching_method text[],
  student_teacher_ratio numeric,
  capacity integer,
  monthly_fee integer,
  registration_fee integer,
  extended_care_fee integer,
  material_fee integer,
  inspection_records jsonb,
  violation_records jsonb,
  staff_turnover_rate numeric,
  features jsonb,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kindergartens ENABLE ROW LEVEL SECURITY;

-- families: 用戶可以查看和管理自己的家庭
CREATE POLICY "Users can view own families" ON public.families
  FOR SELECT USING (
    id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create families" ON public.families
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own families" ON public.families
  FOR UPDATE USING (
    id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

-- family_members: 用戶可以查看和管理自己家庭的成員
CREATE POLICY "Users can view own family members" ON public.family_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own membership" ON public.family_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own family members" ON public.family_members
  FOR UPDATE USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

-- children: 用戶可以管理自己家庭的孩子
CREATE POLICY "Users can view own children" ON public.children
  FOR SELECT USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert children" ON public.children
  FOR INSERT WITH CHECK (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own children" ON public.children
  FOR UPDATE USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own children" ON public.children
  FOR DELETE USING (
    family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
  );

-- growth_records
CREATE POLICY "Users can view own growth records" ON public.growth_records
  FOR SELECT USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert growth records" ON public.growth_records
  FOR INSERT WITH CHECK (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own growth records" ON public.growth_records
  FOR UPDATE USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own growth records" ON public.growth_records
  FOR DELETE USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

-- meal_records
CREATE POLICY "Users can view own meal records" ON public.meal_records
  FOR SELECT USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert meal records" ON public.meal_records
  FOR INSERT WITH CHECK (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own meal records" ON public.meal_records
  FOR UPDATE USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own meal records" ON public.meal_records
  FOR DELETE USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

-- milestones
CREATE POLICY "Users can view own milestones" ON public.milestones
  FOR SELECT USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert milestones" ON public.milestones
  FOR INSERT WITH CHECK (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own milestones" ON public.milestones
  FOR DELETE USING (
    child_id IN (
      SELECT c.id FROM public.children c
      JOIN public.family_members fm ON fm.family_id = c.family_id
      WHERE fm.user_id = auth.uid()
    )
  );

-- places: 所有人可讀
CREATE POLICY "Anyone can view places" ON public.places
  FOR SELECT USING (true);

-- kindergartens: 所有人可讀
CREATE POLICY "Anyone can view kindergartens" ON public.kindergartens
  FOR SELECT USING (true);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_children_family_id ON public.children(family_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_child_id ON public.growth_records(child_id);
CREATE INDEX IF NOT EXISTS idx_meal_records_child_id ON public.meal_records(child_id);
CREATE INDEX IF NOT EXISTS idx_milestones_child_id ON public.milestones(child_id);

-- =============================================
-- Updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER children_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
