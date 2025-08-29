// Database Types for AgroConnect Nigeria
// These types match the Supabase database schema exactly

// User Types
export type UserType = 'farmer' | 'buyer' | 'admin';

export interface Profile {
  id: string;
  user_type: UserType;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Location Types
export interface State {
  id: number;
  name: string;
  code: string;
}

export interface LGA {
  id: number;
  name: string;
  state_id: number;
}

// Farmer Profile Types
export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_name?: string;
  farm_size_hectares?: number;
  state_id?: number;
  lga_id?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  primary_crops?: string[];
  certifications?: string[];
  years_farming?: number;
  created_at: string;
  updated_at: string;
}

// Buyer Profile Types
export type CompanyType = 'processor' | 'exporter' | 'wholesaler' | 'retailer';

export interface BuyerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_type?: CompanyType;
  cac_number?: string;
  tax_id?: string;
  state_id?: number;
  lga_id?: number;
  address?: string;
  purchase_capacity_tons?: number;
  preferred_crops?: string[];
  payment_terms?: string[];
  created_at: string;
  updated_at: string;
}

// Product Types
export type ProductUnit = 'bags' | 'tonnes' | 'kilograms';
export type QualityGrade = 'premium' | 'grade_a' | 'grade_b' | 'grade_c';

export interface Product {
  id: string;
  farmer_id: string;
  title: string;
  crop_type: string;
  variety?: string;
  quantity_available: number;
  unit: ProductUnit;
  price_per_unit: number;
  quality_grade?: QualityGrade;
  harvest_date?: string;
  available_from: string;
  available_until?: string;
  location_state_id?: number;
  location_lga_id?: number;
  description?: string;
  storage_method?: string;
  is_organic: boolean;
  is_active: boolean;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// Inquiry Types
export type InquiryStatus = 'pending' | 'responded' | 'negotiating' | 'accepted' | 'rejected' | 'expired';

export interface ProductInquiry {
  id: string;
  product_id: string;
  buyer_id: string;
  quantity_requested: number;
  proposed_price_per_unit?: number;
  message?: string;
  status: InquiryStatus;
  inquiry_date: string;
  response_deadline: string;
}

// Message Types
export type MessageType = 'text' | 'price_offer' | 'counter_offer' | 'acceptance' | 'image';

export interface Message {
  id: string;
  inquiry_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  message_type: MessageType;
  price_offer?: number;
  quantity_offer?: number;
  is_read: boolean;
  created_at: string;
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'prepared' | 'in_transit' | 'delivered' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'pending' | 'deposit_paid' | 'partial_paid' | 'fully_paid' | 'refunded';

export interface Order {
  id: string;
  inquiry_id?: string;
  farmer_id: string;
  buyer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_address?: string;
  delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Review Types
export type ReviewType = 'product_quality' | 'communication' | 'delivery' | 'payment' | 'overall';

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  review_type: ReviewType;
  created_at: string;
}

// Extended Types with Relations
export interface ProductWithRelations extends Product {
  farmer?: FarmerProfile;
  location_state?: State;
  location_lga?: LGA;
}

export interface ProductInquiryWithRelations extends ProductInquiry {
  product?: Product;
  buyer?: BuyerProfile;
}

export interface MessageWithRelations extends Message {
  sender?: Profile;
  receiver?: Profile;
}

export interface OrderWithRelations extends Order {
  farmer?: FarmerProfile;
  buyer?: BuyerProfile;
  product?: Product;
  inquiry?: ProductInquiry;
}

export interface ReviewWithRelations extends Review {
  reviewer?: Profile;
  reviewee?: Profile;
  order?: Order;
}

// Database Enums (for type safety)
export const USER_TYPES: UserType[] = ['farmer', 'buyer', 'admin'];
export const COMPANY_TYPES: CompanyType[] = ['processor', 'exporter', 'wholesaler', 'retailer'];
export const PRODUCT_UNITS: ProductUnit[] = ['bags', 'tonnes', 'kilograms'];
export const QUALITY_GRADES: QualityGrade[] = ['premium', 'grade_a', 'grade_b', 'grade_c'];
export const INQUIRY_STATUSES: InquiryStatus[] = ['pending', 'responded', 'negotiating', 'accepted', 'rejected', 'expired'];
export const MESSAGE_TYPES: MessageType[] = ['text', 'price_offer', 'counter_offer', 'acceptance', 'image'];
export const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'prepared', 'in_transit', 'delivered', 'completed', 'cancelled', 'disputed'];
export const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'deposit_paid', 'partial_paid', 'fully_paid', 'refunded'];
export const REVIEW_TYPES: ReviewType[] = ['product_quality', 'communication', 'delivery', 'payment', 'overall'];

// Legacy types for backward compatibility (deprecated)
/** @deprecated Use Profile instead */
export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  user_type: 'farmer' | 'buyer';
  state?: string;
  lga?: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Product instead */
export interface LegacyProduct {
  id: string;
  name: string;
  crop_type: string;
  quality_grade: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  seller_id: string;
  state: string;
  lga?: string;
  description?: string;
  images?: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Order instead */
export interface LegacyOrder {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}
