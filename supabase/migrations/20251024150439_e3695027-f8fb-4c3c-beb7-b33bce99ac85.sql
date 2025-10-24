-- Update the Admin@yda.ngo user to SUPERADMIN role
UPDATE public.user_roles
SET role = 'SUPERADMIN'
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'Admin@yda.ngo'
);