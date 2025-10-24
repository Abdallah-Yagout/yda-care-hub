-- First, ensure we have a unique constraint on block(page_id, key)
ALTER TABLE block DROP CONSTRAINT IF EXISTS block_page_key_unique;
ALTER TABLE block ADD CONSTRAINT block_page_key_unique UNIQUE (page_id, key);

-- Ensure we have a home page
INSERT INTO page (slug, title, status, published_at)
VALUES (
  'home',
  '{"ar": "الرئيسية", "en": "Home"}'::jsonb,
  'published',
  now()
)
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title;

-- Update blocks for home page
DO $$
DECLARE
  home_page_id uuid;
BEGIN
  SELECT id INTO home_page_id FROM page WHERE slug = 'home' LIMIT 1;

  -- Hero block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'hero',
    '{"ar": "جمعية السكري اليمنية (YDA)", "en": "Yemen Diabetes Association (YDA)"}'::jsonb,
    '{"ar": "نُساندكم لتعيشوا بصحة أفضل مع السكري — نرفع الوعي، نُحسّن الرعاية، ونُعزّز قدرات المجتمع للوقاية والإدارة السليمة.", "en": "Helping people in Yemen live healthier with diabetes—awareness, better care, and strong community capacity."}'::jsonb,
    1
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- Mission block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'mission',
    '{"ar": "رسالتنا", "en": "Mission"}'::jsonb,
    '{"ar": "تمكين المصابين بالسكري وأُسرهم عبر التثقيف، والفحص المبكر، والإرشاد العلاجي، والدعم النفسي والاجتماعي.", "en": "Empower people living with diabetes and their families through education, early detection, clinical guidance, and psychosocial support."}'::jsonb,
    2
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- Vision block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'vision',
    '{"ar": "رؤيتنا", "en": "Vision"}'::jsonb,
    '{"ar": "يمن يتمتع فيه الجميع بفرص متكافئة للوقاية من السكري وإدارته، مع خفض المضاعفات وتحسين جودة الحياة.", "en": "A Yemen where everyone can prevent and manage diabetes, reducing complications and improving quality of life."}'::jsonb,
    3
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- Values block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'values',
    '{"ar": "قيمنا", "en": "Values"}'::jsonb,
    '{"ar": "النزاهة · التميّز · الشراكة المجتمعية · العدالة في الوصول · الاستدامة", "en": "Integrity · Excellence · Community Partnership · Equity of Access · Sustainability"}'::jsonb,
    4
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- Programs block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'programs',
    '{"ar": "برامجنا وخدماتنا", "en": "Programs & Services"}'::jsonb,
    '{"ar": "التوعية المجتمعية: حملات ميدانية ورسائل رقمية ومواد تثقيفية مبسّطة.\n\nالفحص والإحالة المبكرة: أيام فحص HbA1c وسكر صائم مع تحويلات منظمة للرعاية.\n\nدعم المرضى والأُسر: تثقيف ذاتي، إرشاد غذائي وسلوكي ملائم للسياق اليمني، ودعم نفسي.\n\nتدريب العاملين الصحيين: تشخيص دقيق، رعاية القدم، متابعة منزلية، وبروتوكولات حديثة.\n\nالمدارس والشباب: مبادرات للوقاية المبكرة وتعزيز نمط الحياة الصحي.\n\nالبيانات والجودة: مؤشرات بسيطة لتحسين الجودة واستهداف البرامج.", "en": "Community awareness: field campaigns, digital messaging, and simple educational materials.\n\nEarly screening & referral: HbA1c and fasting glucose screening days with organized care transitions.\n\nPatient & family support: self-management education, nutrition and behavioral counseling adapted to Yemeni context, and psychosocial support.\n\nHealth-worker training: accurate diagnosis, foot care, home follow-up, and modern protocols.\n\nSchools & youth: initiatives for early prevention and promoting healthy lifestyles.\n\nData & quality: simple indicators to improve quality and target programs."}'::jsonb,
    5
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- About Diabetes block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'about_diabetes',
    '{"ar": "عن السكري باختصار", "en": "About Diabetes in Brief"}'::jsonb,
    '{"ar": "السكري حالة مزمنة تنشأ عن نقص الإنسولين أو مقاومته. أعراض شائعة: عطش وتبوّل متكرران، إرهاق، بطء التئام الجروح، تشوش الرؤية، تنميل الأطراف.\n\nالوقاية ممكنة: غذاء متوازن، نشاط بدني منتظم، فحوصات دورية، والالتزام بالخطة العلاجية.", "en": "Diabetes is a chronic condition caused by insulin deficiency or resistance. Common symptoms: frequent thirst and urination, fatigue, slow wound healing, blurred vision, numbness in extremities.\n\nPrevention is possible: balanced diet, regular physical activity, periodic screenings, and adherence to treatment plan."}'::jsonb,
    6
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;

  -- How Diabetes Happens block
  INSERT INTO block (page_id, key, title, content, sort)
  VALUES (
    home_page_id,
    'how_diabetes_happens',
    '{"ar": "كيف يحدث السكري؟", "en": "How Does Diabetes Happen?"}'::jsonb,
    '{"ar": "السكري لا ينتقل بالعدوى؛ بل ينتج عن عوامل متداخلة تشمل الاستعداد الوراثي، العادات الغذائية غير الصحية، قلّة النشاط البدني، والسمنة/زيادة الوزن.", "en": "Diabetes is not contagious; it results from interrelated factors including genetic predisposition, unhealthy eating habits, lack of physical activity, and obesity/overweight."}'::jsonb,
    7
  )
  ON CONFLICT (page_id, key) DO UPDATE
  SET 
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    sort = EXCLUDED.sort;
END $$;

-- Update KPIs (using unique constraint on key only since we don't have year in constraint)
DELETE FROM kpi WHERE key = 'adults_with_diabetes';
INSERT INTO kpi (key, value_int, year)
VALUES ('adults_with_diabetes', 720800, 2024);

DELETE FROM kpi WHERE key = 'adult_prevalence';
INSERT INTO kpi (key, value_dec, year)
VALUES ('adult_prevalence', 5.5, 2024);

-- Create the 18th Annual Conference event
INSERT INTO event (
  slug,
  title,
  summary,
  body,
  city,
  venue,
  start_at,
  end_at,
  status
)
VALUES (
  '18th-annual-conference-2025',
  '{"ar": "المؤتمر العلمي السنوي الثامن عشر لجمعية السكري اليمنية", "en": "18th Annual Scientific Conference of the Yemen Diabetes Association"}'::jsonb,
  '{"ar": "محاور: التحديثات الإكلينيكية، القدم السكرية، التغذية وتغيير السلوك، التثقيف المجتمعي", "en": "Tracks: clinical updates, diabetic-foot care, nutrition & behavior change, community education"}'::jsonb,
  '{"ar": "انضم إلينا في المؤتمر العلمي السنوي الثامن عشر لجمعية السكري اليمنية.\n\nالمحاور الرئيسية:\n• التحديثات الإكلينيكية في علاج السكري\n• العناية بالقدم السكرية\n• التغذية وتغيير السلوك\n• التثقيف المجتمعي والوقاية\n\nالموقع سيُعلن عنه قريباً.", "en": "Join us for the 18th Annual Scientific Conference of the Yemen Diabetes Association.\n\nMain tracks:\n• Clinical updates in diabetes treatment\n• Diabetic foot care\n• Nutrition and behavior change\n• Community education and prevention\n\nVenue to be announced."}'::jsonb,
  '{"ar": "صنعاء", "en": "Sana''a"}'::jsonb,
  '{"ar": "سيُعلن لاحقاً", "en": "To be announced"}'::jsonb,
  '2025-11-12 09:00:00+00',
  '2025-11-14 17:00:00+00',
  'published'
)
ON CONFLICT (slug) DO UPDATE
SET 
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  body = EXCLUDED.body,
  city = EXCLUDED.city,
  venue = EXCLUDED.venue,
  start_at = EXCLUDED.start_at,
  end_at = EXCLUDED.end_at;

-- Update settings (create if doesn't exist)
INSERT INTO settings (
  id,
  org_name,
  phone,
  emails,
  socials,
  address
)
VALUES (
  gen_random_uuid(),
  'Yemen Diabetes Association',
  '+967 1 246 866',
  '["info@yda.ngo"]'::jsonb,
  '{"facebook": "https://www.facebook.com/61556779521467/", "youtube": "https://www.youtube.com/@YemenDiabetesAssociation"}'::jsonb,
  '{"ar": "صنعاء، اليمن", "en": "Sana''a, Yemen"}'::jsonb
)
ON CONFLICT (id) DO UPDATE
SET 
  phone = EXCLUDED.phone,
  emails = EXCLUDED.emails,
  socials = EXCLUDED.socials,
  address = EXCLUDED.address;