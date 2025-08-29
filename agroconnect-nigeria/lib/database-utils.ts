import { supabase } from './supabase';
import type { 
  Profile, 
  FarmerProfile, 
  BuyerProfile, 
  Product, 
  ProductInquiry,
  Message,
  Order,
  Review,
  State,
  LGA
} from '../types/database';
import { 
  MAJOR_CROPS, 
  QUALITY_GRADES, 
  MEASUREMENT_UNITS, 
  COMPANY_TYPES,
  PAYMENT_TERMS,
  CERTIFICATIONS,
  STORAGE_METHODS,
  CROP_VARIETIES
} from '../constants/nigeria';

// Database utility functions for AgroConnect Nigeria

/**
 * Get all Nigerian states
 */
export async function getStates(): Promise<State[]> {
  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

/**
 * Get LGAs for a specific state
 */
export async function getLGAsByState(stateId: number): Promise<LGA[]> {
  const { data, error } = await supabase
    .from('lgas')
    .select('*')
    .eq('state_id', stateId)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get farmer profile by user ID
 */
export async function getFarmerProfile(userId: string): Promise<FarmerProfile | null> {
  const { data, error } = await supabase
    .from('farmer_profiles')
    .select(`
      *,
      state:states(*),
      lga:lgas(*)
    `)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get buyer profile by user ID
 */
export async function getBuyerProfile(userId: string): Promise<BuyerProfile | null> {
  const { data, error } = await supabase
    .from('buyer_profiles')
    .select(`
      *,
      state:states(*),
      lga:lgas(*)
    `)
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Get active products with farmer and location details
 */
export async function getActiveProducts(filters?: {
  cropType?: string;
  stateId?: number;
  lgaId?: number;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
}): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      farmer:farmer_profiles(
        *,
        state:states(*),
        lga:lgas(*)
      ),
      location_state:states(*),
      location_lga:lgas(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (filters?.cropType) {
    query = query.eq('crop_type', filters.cropType);
  }
  if (filters?.stateId) {
    query = query.eq('location_state_id', filters.stateId);
  }
  if (filters?.lgaId) {
    query = query.eq('location_lga_id', filters.lgaId);
  }
  if (filters?.minPrice) {
    query = query.gte('price_per_unit', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price_per_unit', filters.maxPrice);
  }
  if (filters?.isOrganic !== undefined) {
    query = query.eq('is_organic', filters.isOrganic);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Get products by farmer ID
 */
export async function getProductsByFarmer(farmerId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      location_state:states(*),
      location_lga:lgas(*)
    `)
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * Get inquiries for a buyer
 */
export async function getBuyerInquiries(buyerId: string): Promise<ProductInquiry[]> {
  const { data, error } = await supabase
    .from('product_inquiries')
    .select(`
      *,
      product:products(
        *,
        farmer:farmer_profiles(*)
      )
    `)
    .eq('buyer_id', buyerId)
    .order('inquiry_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * Get inquiries for a farmer's products
 */
export async function getFarmerInquiries(farmerId: string): Promise<ProductInquiry[]> {
  const { data, error } = await supabase
    .from('product_inquiries')
    .select(`
      *,
      product:products(*),
      buyer:buyer_profiles(*)
    `)
    .eq('product.farmer_id', farmerId)
    .order('inquiry_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * Get messages for an inquiry
 */
export async function getInquiryMessages(inquiryId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles(*),
      receiver:profiles(*)
    `)
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

/**
 * Get orders for a user (farmer or buyer)
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      farmer:farmer_profiles(*),
      buyer:buyer_profiles(*),
      product:products(*),
      inquiry:product_inquiries(*)
    `)
    .or(`farmer.user_id.eq.${userId},buyer.user_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

/**
 * Get reviews for a user
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles(*),
      reviewee:profiles(*),
      order:orders(*)
    `)
    .or(`reviewer_id.eq.${userId},reviewee_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Validation functions

/**
 * Validate crop type
 */
export function isValidCropType(cropType: string): boolean {
  return MAJOR_CROPS.includes(cropType as any);
}

/**
 * Validate quality grade
 */
export function isValidQualityGrade(grade: string): boolean {
  return QUALITY_GRADES.includes(grade as any);
}

/**
 * Validate measurement unit
 */
export function isValidUnit(unit: string): boolean {
  return MEASUREMENT_UNITS.includes(unit as any);
}

/**
 * Validate company type
 */
export function isValidCompanyType(type: string): boolean {
  return COMPANY_TYPES.includes(type as any);
}

/**
 * Validate payment terms
 */
export function isValidPaymentTerm(term: string): boolean {
  return PAYMENT_TERMS.includes(term as any);
}

/**
 * Validate certification
 */
export function isValidCertification(cert: string): boolean {
  return CERTIFICATIONS.includes(cert as any);
}

/**
 * Validate storage method
 */
export function isValidStorageMethod(method: string): boolean {
  return STORAGE_METHODS.includes(method as any);
}

/**
 * Get crop varieties for a specific crop
 */
export function getCropVarieties(cropType: string): string[] {
  return CROP_VARIETIES[cropType as keyof typeof CROP_VARIETIES] || [];
}

/**
 * Validate crop variety
 */
export function isValidCropVariety(cropType: string, variety: string): boolean {
  const varieties = getCropVarieties(cropType);
  return varieties.includes(variety);
}

// Helper functions

/**
 * Calculate total amount for an order
 */
export function calculateOrderTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice;
}

/**
 * Format price in Nigerian Naira
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price);
}

/**
 * Get bag size for a crop type
 */
export function getBagSize(cropType: string): number {
  const bagSizes: Record<string, number> = {
    'Rice': 50,
    'Maize': 50,
    'Cassava': 50,
    'Yam': 50,
    'Plantain': 50,
    'Sorghum': 50,
    'Millet': 50,
    'Groundnut': 50,
    'Soybean': 50,
    'Cowpea': 50
  };
  return bagSizes[cropType] || 50;
}

/**
 * Convert quantity between units
 */
export function convertQuantity(
  quantity: number, 
  fromUnit: string, 
  toUnit: string, 
  cropType?: string
): number {
  if (fromUnit === toUnit) return quantity;
  
  // Convert to kg first
  let kgQuantity = quantity;
  if (fromUnit === 'bags') {
    const bagSize = cropType ? getBagSize(cropType) : 50;
    kgQuantity = quantity * bagSize;
  } else if (fromUnit === 'tonnes') {
    kgQuantity = quantity * 1000;
  }
  
  // Convert from kg to target unit
  if (toUnit === 'bags') {
    const bagSize = cropType ? getBagSize(cropType) : 50;
    return kgQuantity / bagSize;
  } else if (toUnit === 'tonnes') {
    return kgQuantity / 1000;
  }
  
  return kgQuantity; // kilograms
}

/**
 * Check if inquiry is expired
 */
export function isInquiryExpired(responseDeadline: string): boolean {
  return new Date(responseDeadline) < new Date();
}

/**
 * Get days until inquiry expires
 */
export function getDaysUntilExpiry(responseDeadline: string): number {
  const deadline = new Date(responseDeadline);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Generate product title from crop type and variety
 */
export function generateProductTitle(cropType: string, variety?: string): string {
  if (variety) {
    return `${cropType} - ${variety}`;
  }
  return cropType;
}

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Nigerian phone number
  // Nigerian numbers are 11 digits starting with 0 or 13 digits starting with +234
  if (cleanPhone.startsWith('234')) {
    return cleanPhone.length === 13;
  } else if (cleanPhone.startsWith('0')) {
    return cleanPhone.length === 11;
  }
  
  return false;
}

/**
 * Format Nigerian phone number
 */
export function formatNigerianPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('234')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('0')) {
    return `+234${cleanPhone.slice(1)}`;
  }
  
  return phone;
}
