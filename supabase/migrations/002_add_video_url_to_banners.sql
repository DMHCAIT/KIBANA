-- Add video_url column to banners table for hero section videos
ALTER TABLE public.banners 
ADD COLUMN IF NOT EXISTS video_url TEXT;

