/*
  # Create Demo Users for Authentication Testing

  1. Demo Accounts
    - Admin user: admin@happyfeet.cm (password: password123)
    - Regular user: user@happyfeet.cm (password: password123)
    
  2. Security
    - These are demo accounts for testing purposes
    - In production, these should be removed or changed
*/

-- Insert demo admin user profile
INSERT INTO profiles (id, email, full_name, is_admin) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@happyfeet.cm', 'Admin User', true),
  ('00000000-0000-0000-0000-000000000002', 'user@happyfeet.cm', 'Regular User', false)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_admin = EXCLUDED.is_admin;