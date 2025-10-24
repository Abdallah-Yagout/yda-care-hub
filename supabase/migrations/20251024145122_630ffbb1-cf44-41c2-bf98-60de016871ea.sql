-- Create video table for YouTube gallery with bilingual metadata
CREATE TABLE public.video (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  title JSONB NOT NULL DEFAULT '{"ar": "", "en": ""}',
  description JSONB DEFAULT '{"ar": "", "en": ""}',
  channel JSONB DEFAULT '{"ar": "", "en": ""}',
  published_at TIMESTAMP WITH TIME ZONE,
  thumbnail_url TEXT,
  tags JSONB DEFAULT '[]',
  sort INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video ENABLE ROW LEVEL SECURITY;

-- Editors and SuperAdmins can manage videos
CREATE POLICY "Editors and SuperAdmins can manage videos"
ON public.video
FOR ALL
USING (has_role(auth.uid(), 'EDITOR'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Everyone can view published videos
CREATE POLICY "Everyone can view published videos"
ON public.video
FOR SELECT
USING (status = 'published' OR has_role(auth.uid(), 'EDITOR'::app_role) OR has_role(auth.uid(), 'SUPERADMIN'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_video_updated_at
BEFORE UPDATE ON public.video
FOR EACH ROW
EXECUTE FUNCTION public.update_content_analytics_updated_at();

-- Create indexes for performance
CREATE INDEX idx_video_youtube_id ON public.video(youtube_id);
CREATE INDEX idx_video_status ON public.video(status);
CREATE INDEX idx_video_sort ON public.video(sort);
CREATE INDEX idx_video_tags ON public.video USING GIN(tags);

-- Seed the 8 YouTube videos with bilingual metadata
INSERT INTO public.video (youtube_id, title, description, tags, sort, thumbnail_url) VALUES
(
  'I_lgpEYc7bc',
  '{"ar": "الصيام والداء السكري — أ.د. زايد عاطف", "en": "Fasting & Diabetes — Prof. Zayed Aatif"}',
  '{"ar": "إرشادات آمنة للصيام لمرضى السكري بإشراف أ.د. زايد عاطف.", "en": "Safe fasting guidance for people with diabetes (Prof. Zayed Aatif)."}',
  '["الصيام","سكري","تثقيف"]',
  1,
  'https://img.youtube.com/vi/I_lgpEYc7bc/maxresdefault.jpg'
),
(
  '5Emt7rJX8Jg',
  '{"ar": "الحلقة الثالثة: الحج والداء السكري — أ.د. زايد عاطف", "en": "Hajj & Diabetes (Ep. 3) — Prof. Zayed Aatif"}',
  '{"ar": "التعامل مع السكري أثناء الحج ونصائح عملية للحجاج.", "en": "Practical diabetes tips for pilgrims during Hajj."}',
  '["الحج","سكري","إرشادات"]',
  2,
  'https://img.youtube.com/vi/5Emt7rJX8Jg/maxresdefault.jpg'
),
(
  'mZM8q8nppnU',
  '{"ar": "مخاطر الصيام المحتملة على مريض السكري — أ.د. زايد عاطف", "en": "Potential Fasting Risks for PWD — Prof. Zayed Aatif"}',
  '{"ar": "نظرة عامة على المخاطر؛ استشر الطبيب قبل الصيام.", "en": "Short risk overview; consult clinician before fasting."}',
  '["الصيام","مخاطر","سكري"]',
  3,
  'https://img.youtube.com/vi/mZM8q8nppnU/maxresdefault.jpg'
),
(
  'DY3bWJ8-ZEs',
  '{"ar": "نصائح لمريض السكري الصائم — أ.د. زايد عاطف", "en": "Tips for Fasting with Diabetes — Prof. Zayed Aatif"}',
  '{"ar": "نصائح عملية لصيام آمن لمرضى السكري.", "en": "Practical tips for safe fasting with diabetes."}',
  '["الصيام","نصائح","سكري"]',
  4,
  'https://img.youtube.com/vi/DY3bWJ8-ZEs/maxresdefault.jpg'
),
(
  'OG_qd0W34-Q',
  '{"ar": "الصيام والداء السكري: تعديل الدواء خلال الصيام — أ.د. زايد عاطف", "en": "Adjusting Diabetes Meds During Fasting — Prof. Zayed Aatif"}',
  '{"ar": "كيفية تعديل جرعات الدواء بأمان خلال شهر الصيام.", "en": "How to safely adjust medication doses during fasting."}',
  '["دواء","الصيام","سكري"]',
  5,
  'https://img.youtube.com/vi/OG_qd0W34-Q/maxresdefault.jpg'
),
(
  'u7Z5FGDIf5Q',
  '{"ar": "الصيام والداء السكري: تساؤلات شائعة — أ.د. زايد عاطف", "en": "Common Questions on Fasting & Diabetes — Prof. Zayed Aatif"}',
  '{"ar": "إجابات على الأسئلة الشائعة حول الصيام والسكري.", "en": "Answers to frequently asked questions about fasting and diabetes."}',
  '["أسئلة","الصيام","سكري"]',
  6,
  'https://img.youtube.com/vi/u7Z5FGDIf5Q/maxresdefault.jpg'
),
(
  '9-6Qpx6ia54',
  '{"ar": "الداء السكري والحج — أ.د. زايد أحمد عاطف", "en": "Diabetes & Hajj — Prof. Zayed Ahmed Aatif"}',
  '{"ar": "نصائح لمرضى السكري أثناء أداء مناسك الحج.", "en": "Diabetes management tips during Hajj pilgrimage."}',
  '["الحج","سكري"]',
  7,
  'https://img.youtube.com/vi/9-6Qpx6ia54/maxresdefault.jpg'
),
(
  'LPb612d4ctw',
  '{"ar": "الحج والداء السكري — أ.د. زايد عاطف", "en": "Hajj and Diabetes — Prof. Zayed Aatif"}',
  '{"ar": "إرشادات شاملة للحجاج من مرضى السكري.", "en": "Comprehensive guidance for pilgrims with diabetes."}',
  '["الحج","سكري"]',
  8,
  'https://img.youtube.com/vi/LPb612d4ctw/maxresdefault.jpg'
);