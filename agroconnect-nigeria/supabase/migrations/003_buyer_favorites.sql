-- Migration: Add buyer favorites table
-- This table allows buyers to save products they're interested in

-- Buyer Favorites Table
CREATE TABLE public.buyer_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.buyer_profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, product_id)
);

-- Performance indexes
CREATE INDEX idx_buyer_favorites_buyer_id ON public.buyer_favorites(buyer_id);
CREATE INDEX idx_buyer_favorites_product_id ON public.buyer_favorites(product_id);
CREATE INDEX idx_buyer_favorites_created_at ON public.buyer_favorites(created_at);

-- Enable Row Level Security
ALTER TABLE public.buyer_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for buyer_favorites
CREATE POLICY "Buyers can view their own favorites" ON public.buyer_favorites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can add products to their favorites" ON public.buyer_favorites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can remove products from their favorites" ON public.buyer_favorites
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_buyer_favorites_updated_at BEFORE UPDATE ON public.buyer_favorites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
