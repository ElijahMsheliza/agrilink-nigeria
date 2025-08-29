-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table that extends Supabase auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_type TEXT CHECK (user_type IN ('farmer', 'buyer', 'admin')) NOT NULL,
  phone TEXT UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nigerian states
CREATE TABLE public.states (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

-- Local Government Areas
CREATE TABLE public.lgas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  state_id INTEGER REFERENCES public.states(id),
  UNIQUE(name, state_id)
);

-- Farmer Profiles Table
CREATE TABLE public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_name TEXT,
  farm_size_hectares DECIMAL(10,2),
  state_id INTEGER REFERENCES public.states(id),
  lga_id INTEGER REFERENCES public.lgas(id),
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  primary_crops TEXT[], -- Array of crop names
  certifications TEXT[], -- Organic, NAFDAC, etc.
  years_farming INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Buyer Profiles Table
CREATE TABLE public.buyer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_type TEXT CHECK (company_type IN ('processor', 'exporter', 'wholesaler', 'retailer')),
  cac_number TEXT, -- Nigerian company registration
  tax_id TEXT,
  state_id INTEGER REFERENCES public.states(id),
  lga_id INTEGER REFERENCES public.lgas(id),
  address TEXT,
  purchase_capacity_tons DECIMAL(10,2),
  preferred_crops TEXT[], -- Array of crop names
  payment_terms TEXT[], -- ['cash', 'credit_30_days', 'credit_60_days']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.farmer_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  crop_type TEXT NOT NULL, -- Must be from approved crops list
  variety TEXT, -- e.g., "FARO 44" for rice
  quantity_available DECIMAL(10,2) NOT NULL,
  unit TEXT CHECK (unit IN ('bags', 'tonnes', 'kilograms')) NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  quality_grade TEXT CHECK (quality_grade IN ('premium', 'grade_a', 'grade_b', 'grade_c')),
  harvest_date DATE,
  available_from DATE NOT NULL,
  available_until DATE,
  location_state_id INTEGER REFERENCES public.states(id),
  location_lga_id INTEGER REFERENCES public.lgas(id),
  description TEXT,
  storage_method TEXT,
  is_organic BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product Inquiries Table
CREATE TABLE public.product_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.buyer_profiles(id) ON DELETE CASCADE,
  quantity_requested DECIMAL(10,2) NOT NULL,
  proposed_price_per_unit DECIMAL(10,2),
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'responded', 'negotiating', 'accepted', 'rejected', 'expired')) DEFAULT 'pending',
  inquiry_date TIMESTAMPTZ DEFAULT NOW(),
  response_deadline TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

-- Messages Table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.product_inquiries(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id),
  receiver_id UUID REFERENCES public.profiles(id),
  message_text TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'price_offer', 'counter_offer', 'acceptance', 'image')) DEFAULT 'text',
  price_offer DECIMAL(10,2), -- For price negotiation messages
  quantity_offer DECIMAL(10,2), -- For quantity negotiation
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID REFERENCES public.product_inquiries(id),
  farmer_id UUID REFERENCES public.farmer_profiles(id),
  buyer_id UUID REFERENCES public.buyer_profiles(id),
  product_id UUID REFERENCES public.products(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'prepared', 'in_transit', 'delivered', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'deposit_paid', 'partial_paid', 'fully_paid', 'refunded')) DEFAULT 'pending',
  delivery_address TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewee_id UUID REFERENCES public.profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  review_type TEXT CHECK (review_type IN ('product_quality', 'communication', 'delivery', 'payment', 'overall')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_products_crop_type ON public.products(crop_type);
CREATE INDEX idx_products_location ON public.products(location_state_id, location_lga_id);
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_harvest_date ON public.products(harvest_date);
CREATE INDEX idx_inquiries_status ON public.product_inquiries(status);
CREATE INDEX idx_messages_inquiry ON public.messages(inquiry_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_farmer ON public.orders(farmer_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_farmer_profiles_user_id ON public.farmer_profiles(user_id);
CREATE INDEX idx_buyer_profiles_user_id ON public.buyer_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for states and lgas (public read access)
CREATE POLICY "Anyone can view states" ON public.states
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view lgas" ON public.lgas
  FOR SELECT USING (true);

-- RLS Policies for farmer_profiles
CREATE POLICY "Users can view their own farmer profile" ON public.farmer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer profile" ON public.farmer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farmer profile" ON public.farmer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for buyer_profiles
CREATE POLICY "Users can view their own buyer profile" ON public.buyer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyer profile" ON public.buyer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyer profile" ON public.buyer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Farmers can view their own products" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can insert their own products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can update their own products" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    )
  );

-- RLS Policies for product_inquiries
CREATE POLICY "Buyers can view their own inquiries" ON public.product_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can view inquiries for their products" ON public.product_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.farmer_profiles fp ON fp.id = p.farmer_id
      WHERE p.id = product_id AND fp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can insert inquiries" ON public.product_inquiries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Buyers can update their own inquiries" ON public.product_inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages they sent or received" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update messages they sent" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid());

-- RLS Policies for orders
CREATE POLICY "Users can view orders they're involved in" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update orders they're involved in" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.farmer_profiles fp 
      WHERE fp.id = farmer_id AND fp.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.buyer_profiles bp 
      WHERE bp.id = buyer_id AND bp.user_id = auth.uid()
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Users can view reviews for orders they're involved in" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.farmer_profiles fp ON fp.id = o.farmer_id
      WHERE o.id = order_id AND fp.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.buyer_profiles bp ON bp.id = o.buyer_id
      WHERE o.id = order_id AND bp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert reviews for orders they're involved in" ON public.reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    (EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.farmer_profiles fp ON fp.id = o.farmer_id
      WHERE o.id = order_id AND fp.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.buyer_profiles bp ON bp.id = o.buyer_id
      WHERE o.id = order_id AND bp.user_id = auth.uid()
    ))
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farmer_profiles_updated_at BEFORE UPDATE ON public.farmer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_profiles_updated_at BEFORE UPDATE ON public.buyer_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
