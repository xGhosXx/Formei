-- ============================================================
-- FORMEI - Supabase Schema
-- Execute este SQL no Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES (dados extras do usuário vinculados ao auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_color TEXT DEFAULT '#7c3aed',
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FORMS
CREATE TABLE IF NOT EXISTS forms (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Formulário sem título',
  description TEXT DEFAULT '',
  emoji TEXT DEFAULT '📋',
  fields JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'trash')),
  theme_color TEXT DEFAULT '#7c3aed',
  webhook_url TEXT DEFAULT '',
  conditional_rules JSONB DEFAULT '[]'::jsonb,
  views INTEGER DEFAULT 0,
  folder_id BIGINT REFERENCES folders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FOLDERS
CREATE TABLE IF NOT EXISTS folders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📁',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RESPONSES
CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  form_id BIGINT NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 4. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'new_response',
  form_id BIGINT REFERENCES forms(id) ON DELETE CASCADE,
  form_title TEXT DEFAULT '',
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_forms_user_id ON forms(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_folder_id ON forms(folder_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_form_id ON responses(form_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- FOLDERS policies
CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create folders"
  ON folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  USING (auth.uid() = user_id);

-- FORMS policies
CREATE POLICY "Users can view own forms"
  ON forms FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create forms"
  ON forms FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own forms"
  ON forms FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own forms"
  ON forms FOR DELETE
  USING (auth.uid() = user_id);

-- Public access to published forms (for form respondents)
CREATE POLICY "Anyone can view published forms"
  ON forms FOR SELECT
  USING (status = 'published');

-- RESPONSES policies
-- Form owners can view responses to their forms
CREATE POLICY "Form owners can view responses"
  ON responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms WHERE forms.id = responses.form_id AND forms.user_id = auth.uid()
    )
  );

-- Anyone can insert responses (public form submissions)
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM forms WHERE forms.id = form_id AND forms.status = 'published'
    )
  );

-- Form owners can delete responses
CREATE POLICY "Form owners can delete responses"
  ON responses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM forms WHERE forms.id = responses.form_id AND forms.user_id = auth.uid()
    )
  );

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_color, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_color',
      (ARRAY['#7c3aed', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'])[floor(random() * 8 + 1)::int]
    ),
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Increment form views (called via RPC)
-- ============================================================
CREATE OR REPLACE FUNCTION increment_form_views(form_id_input BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE forms SET views = views + 1 WHERE id = form_id_input AND status = 'published';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FUNCTION: Create notification on new response (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_response()
RETURNS TRIGGER AS $$
DECLARE
  v_form RECORD;
BEGIN
  SELECT id, user_id, title INTO v_form FROM forms WHERE id = NEW.form_id;
  IF v_form.id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, form_id, form_title, message, read)
    VALUES (
      v_form.user_id,
      'new_response',
      v_form.id,
      v_form.title,
      'Nova resposta no formulário "' || v_form.title || '"',
      false
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_response ON responses;
CREATE TRIGGER on_new_response
  AFTER INSERT ON responses
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_response();

-- ============================================================
-- STORAGE: Create uploads bucket
-- ============================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can view uploaded files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

-- ============================================================
-- 6. PAYMENTS (AbacatePay integration)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkout_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'business')),
  amount INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_checkout_id ON payments(checkout_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Server can insert/update payments (via service key)
CREATE POLICY "Service can manage payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);
