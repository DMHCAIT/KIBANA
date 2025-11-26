-- Add specifications JSONB field to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS specifications JSONB;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_specifications ON public.products USING GIN (specifications);

