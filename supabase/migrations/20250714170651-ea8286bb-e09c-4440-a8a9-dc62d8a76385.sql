
-- Insert admin user into Supabase auth.users table
-- Note: This creates the user directly in the auth system
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@restaurant.com',
  crypt('admin1234', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Also insert into identities table for proper authentication
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@restaurant.com'),
  jsonb_build_object('sub', (SELECT id FROM auth.users WHERE email = 'admin@restaurant.com')::text, 'email', 'admin@restaurant.com'),
  'email',
  NOW(),
  NOW()
);
