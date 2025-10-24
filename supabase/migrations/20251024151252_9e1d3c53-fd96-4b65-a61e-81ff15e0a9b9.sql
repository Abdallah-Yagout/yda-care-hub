-- Ensure admin@yda.ngo is SUPERADMIN (case-insensitive), updating or inserting as needed
BEGIN;

-- 1) Update existing role rows to SUPERADMIN
UPDATE public.user_roles ur
SET role = 'SUPERADMIN'
WHERE ur.user_id IN (
  SELECT id FROM auth.users WHERE lower(email) = 'admin@yda.ngo'
);

-- 2) Insert role row if none exists for that user
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'SUPERADMIN'::app_role
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
WHERE lower(u.email) = 'admin@yda.ngo'
  AND ur.user_id IS NULL;

COMMIT;