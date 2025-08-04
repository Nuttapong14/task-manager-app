-- Add additional profile fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.bio IS 'User biography or description';
COMMENT ON COLUMN public.profiles.location IS 'User location (city, country)';
COMMENT ON COLUMN public.profiles.website IS 'User website URL';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number';