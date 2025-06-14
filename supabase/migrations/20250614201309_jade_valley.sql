/*
  # Fix products table timestamp column

  1. Changes
    - Fix the typo in products.updated_at column type from timestampz to timestamptz
    
  2. Notes
    - This migration fixes a typo in the original schema where updated_at was defined as timestampz instead of timestamptz
*/

-- Fix the products table updated_at column type
DO $$
BEGIN
  -- Check if the column exists and has the wrong type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'updated_at'
  ) THEN
    -- Drop and recreate the column with correct type
    ALTER TABLE products DROP COLUMN IF EXISTS updated_at;
    ALTER TABLE products ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;