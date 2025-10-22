-- Create role enum
CREATE TYPE public.app_role AS ENUM ('SUPERADMIN', 'EDITOR', 'VIEWER');

-- Users table (extends Supabase auth)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'VIEWER',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "SuperAdmins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "SuperAdmins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "SuperAdmins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "SuperAdmins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'SUPERADMIN'));

-- Settings table
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name text NOT NULL DEFAULT 'Yemen Diabetes Association',
  emails jsonb DEFAULT '[]'::jsonb,
  phone text,
  address jsonb,
  working jsonb,
  socials jsonb,
  default_meta_title jsonb,
  default_meta_desc jsonb,
  default_images jsonb,
  analytics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "SuperAdmins can update settings"
  ON public.settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'SUPERADMIN'));

-- Pages table
CREATE TABLE public.page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  excerpt jsonb,
  body jsonb,
  seo_title jsonb,
  seo_desc jsonb,
  status text DEFAULT 'published',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published pages"
  ON public.page FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can insert pages"
  ON public.page FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can update pages"
  ON public.page FOR UPDATE
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can delete pages"
  ON public.page FOR DELETE
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Blocks table
CREATE TABLE public.block (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.page(id) ON DELETE CASCADE,
  key text NOT NULL,
  title jsonb,
  content jsonb,
  media jsonb,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.block ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view blocks of published pages"
  ON public.block FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.page 
      WHERE page.id = block.page_id AND (page.status = 'published' OR public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'))
    )
  );

CREATE POLICY "Editors and SuperAdmins can insert blocks"
  ON public.block FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can update blocks"
  ON public.block FOR UPDATE
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can delete blocks"
  ON public.block FOR DELETE
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- KPIs table
CREATE TABLE public.kpi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_int bigint,
  value_dec numeric(8,2),
  value_text jsonb,
  year int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.kpi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view KPIs"
  ON public.kpi FOR SELECT
  USING (true);

CREATE POLICY "Editors and SuperAdmins can manage KPIs"
  ON public.kpi FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Events table
CREATE TABLE public.event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  summary jsonb,
  body jsonb,
  venue jsonb,
  city jsonb,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  capacity int,
  status text DEFAULT 'published',
  cover_url text,
  gallery jsonb,
  external_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published events"
  ON public.event FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can manage events"
  ON public.event FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Programs table
CREATE TABLE public.program (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  summary jsonb,
  body jsonb,
  icon text,
  cover_url text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.program ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published programs"
  ON public.program FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can manage programs"
  ON public.program FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Posts table
CREATE TABLE public.post (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title jsonb NOT NULL,
  excerpt jsonb,
  body jsonb,
  type text DEFAULT 'article',
  cover_url text,
  status text DEFAULT 'published',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.post ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published posts"
  ON public.post FOR SELECT
  USING (status = 'published' OR public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

CREATE POLICY "Editors and SuperAdmins can manage posts"
  ON public.post FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Partners table
CREATE TABLE public.partner (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL,
  url text,
  logo_url text,
  sort int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.partner ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view partners"
  ON public.partner FOR SELECT
  USING (true);

CREATE POLICY "Editors and SuperAdmins can manage partners"
  ON public.partner FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Menus table
CREATE TABLE public.menu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view menus"
  ON public.menu FOR SELECT
  USING (true);

CREATE POLICY "Editors and SuperAdmins can manage menus"
  ON public.menu FOR ALL
  USING (public.has_role(auth.uid(), 'EDITOR') OR public.has_role(auth.uid(), 'SUPERADMIN'));

-- Submissions table
CREATE TABLE public.submission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.submission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view submissions"
  ON public.submission FOR SELECT
  USING (public.has_role(auth.uid(), 'SUPERADMIN') OR public.has_role(auth.uid(), 'EDITOR'));

CREATE POLICY "Anyone can insert submissions"
  ON public.submission FOR INSERT
  WITH CHECK (true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('events', 'events', true),
  ('posts', 'posts', true),
  ('programs', 'programs', true),
  ('partners', 'partners', true),
  ('shared', 'shared', true);

-- Storage policies for events bucket
CREATE POLICY "Public can view event files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'events');

CREATE POLICY "Authenticated users can upload event files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'events' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'events' AND auth.role() = 'authenticated');

-- Storage policies for posts bucket
CREATE POLICY "Public can view post files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Authenticated users can upload post files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'posts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update post files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'posts' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete post files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'posts' AND auth.role() = 'authenticated');

-- Storage policies for programs bucket
CREATE POLICY "Public can view program files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'programs');

CREATE POLICY "Authenticated users can upload program files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'programs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update program files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'programs' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete program files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'programs' AND auth.role() = 'authenticated');

-- Storage policies for partners bucket
CREATE POLICY "Public can view partner files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partners');

CREATE POLICY "Authenticated users can upload partner files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'partners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update partner files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'partners' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete partner files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'partners' AND auth.role() = 'authenticated');

-- Storage policies for shared bucket
CREATE POLICY "Public can view shared files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shared');

CREATE POLICY "Authenticated users can upload shared files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'shared' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update shared files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'shared' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete shared files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'shared' AND auth.role() = 'authenticated');