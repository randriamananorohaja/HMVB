-- Add birth_place and address to members table
ALTER TABLE members
ADD COLUMN birth_place TEXT,
ADD COLUMN address TEXT;
