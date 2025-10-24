-- Create table for storing generated/curated images with bilingual metadata
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('hero', 'community', 'training', 'nutrition', 'youth', 'conference', 'general')),
  alt_text JSONB NOT NULL DEFAULT '{"ar": "", "en": ""}',
  caption JSONB DEFAULT '{"ar": "", "en": ""}',
  prompt TEXT,
  source TEXT NOT NULL CHECK (source IN ('generated', 'pexels', 'unsplash', 'uploaded')),
  source_attribution TEXT,
  tags TEXT[] DEFAULT '{}',
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  mime_type TEXT DEFAULT 'image/png',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Editors and SuperAdmins can manage media
CREATE POLICY "Editors and SuperAdmins can manage media"
ON public.media_library
FOR ALL
USING (has_role(auth.uid(), 'EDITOR'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Everyone can view media
CREATE POLICY "Everyone can view media"
ON public.media_library
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_media_library_updated_at
BEFORE UPDATE ON public.media_library
FOR EACH ROW
EXECUTE FUNCTION public.update_content_analytics_updated_at();

-- Create index for faster category queries
CREATE INDEX idx_media_library_category ON public.media_library(category);
CREATE INDEX idx_media_library_source ON public.media_library(source);
CREATE INDEX idx_media_library_is_featured ON public.media_library(is_featured);
CREATE INDEX idx_media_library_tags ON public.media_library USING GIN(tags);