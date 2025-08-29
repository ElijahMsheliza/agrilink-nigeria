import { MAJOR_CROPS, QUALITY_GRADES, MEASUREMENT_UNITS, PRICE_RANGES } from '../constants/nigeria';
import type { Product, ProductStatus } from '../types/database';

// Generate auto product title from crop and variety
export function generateProductTitle(cropType: string, variety?: string): string {
  const crop = cropType.trim();
  const varietyText = variety?.trim();
  
  if (varietyText) {
    return `${crop} - ${varietyText}`;
  }
  
  return crop;
}

// Format price in Nigerian Naira
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Calculate total value of product
export function calculateTotalValue(quantity: number, pricePerUnit: number): number {
  return quantity * pricePerUnit;
}

// Format total value with currency
export function formatTotalValue(quantity: number, pricePerUnit: number): string {
  const total = calculateTotalValue(quantity, pricePerUnit);
  return formatPrice(total);
}

// Validate product data comprehensively
export function validateProductData(data: Partial<Product>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic info validation
  if (!data.crop_type || !MAJOR_CROPS.includes(data.crop_type)) {
    errors.push('Crop type is required and must be from approved list');
  }

  if (!data.title || data.title.length < 10 || data.title.length > 100) {
    errors.push('Product title must be between 10 and 100 characters');
  }

  if (!data.quality_grade || !QUALITY_GRADES.includes(data.quality_grade)) {
    errors.push('Quality grade is required');
  }

  // Quantity and pricing validation
  if (!data.quantity_available || data.quantity_available <= 0) {
    errors.push('Quantity must be a positive number');
  }

  if (!data.price_per_unit || data.price_per_unit < 100 || data.price_per_unit > 1000000) {
    errors.push('Price must be between ₦100 and ₦1,000,000');
  }

  if (!data.unit || !MEASUREMENT_UNITS.includes(data.unit)) {
    errors.push('Unit selection is required');
  }

  // Date validation
  if (data.harvest_date) {
    const harvestDate = new Date(data.harvest_date);
    const now = new Date();
    
    // Allow harvest dates up to 1 year in the future (for pre-orders)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
    
    if (harvestDate > maxFutureDate) {
      errors.push('Harvest date cannot be more than 1 year in the future');
    }
  }

  if (data.available_from && data.available_until) {
    const fromDate = new Date(data.available_from);
    const untilDate = new Date(data.available_until);
    
    if (fromDate >= untilDate) {
      errors.push('Available until date must be after available from date');
    }
  }

  // Description validation
  if (data.description && data.description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Get product status
export function getProductStatus(product: Product): ProductStatus {
  const now = new Date();
  
  // Check if product is expired
  if (product.available_until && new Date(product.available_until) < now) {
    return 'expired';
  }
  
  // Check if product is available
  if (product.available_from && new Date(product.available_from) > now) {
    return 'pending';
  }
  
  // Check if product has quantity
  if (product.quantity_available <= 0) {
    return 'out_of_stock';
  }
  
  // Check if product is active
  if (product.status === 'active') {
    return 'active';
  }
  
  return product.status || 'inactive';
}

// Get status display text
export function getStatusDisplayText(status: ProductStatus): string {
  const statusTexts: Record<ProductStatus, string> = {
    'active': 'Active',
    'inactive': 'Inactive',
    'pending': 'Pending',
    'expired': 'Expired',
    'out_of_stock': 'Out of Stock',
    'draft': 'Draft'
  };

  return statusTexts[status] || 'Unknown';
}

// Get status color class
export function getStatusColorClass(status: ProductStatus): string {
  const statusColors: Record<ProductStatus, string> = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'expired': 'bg-red-100 text-red-800',
    'out_of_stock': 'bg-orange-100 text-orange-800',
    'draft': 'bg-blue-100 text-blue-800'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
}



// Calculate bulk pricing discount
export function calculateBulkDiscount(quantity: number, basePrice: number, discountPercentage: number): number {
  const totalPrice = quantity * basePrice;
  const discount = totalPrice * (discountPercentage / 100);
  return totalPrice - discount;
}

// Validate price is within reasonable Nigerian market range
export function validatePriceRange(price: number, cropType: string): { isValid: boolean; message?: string } {
  const cropPriceRanges = PRICE_RANGES[cropType as keyof typeof PRICE_RANGES];
  
  if (!cropPriceRanges) {
    return { isValid: true }; // No specific range defined for this crop
  }
  
  if (price < cropPriceRanges.min) {
    return { 
      isValid: false, 
      message: `Price seems too low for ${cropType}. Typical range: ${formatPrice(cropPriceRanges.min)} - ${formatPrice(cropPriceRanges.max)}` 
    };
  }
  
  if (price > cropPriceRanges.max) {
    return { 
      isValid: false, 
      message: `Price seems too high for ${cropType}. Typical range: ${formatPrice(cropPriceRanges.min)} - ${formatPrice(cropPriceRanges.max)}` 
    };
  }
  
  return { isValid: true };
}

// Get product summary for display
export function getProductSummary(product: Product): {
  title: string;
  price: string;
  quantity: string;
  status: string;
  statusColor: string;
} {
  return {
    title: product.title,
    price: formatPrice(product.price_per_unit),
    quantity: `${product.quantity_available} ${product.unit}`,
    status: getStatusDisplayText(getProductStatus(product)),
    statusColor: getStatusColorClass(getProductStatus(product))
  };
}
