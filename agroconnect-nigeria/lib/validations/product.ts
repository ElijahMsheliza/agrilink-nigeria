import { z } from 'zod';
import { MAJOR_CROPS, QUALITY_GRADES, MEASUREMENT_UNITS, STORAGE_METHODS, CERTIFICATIONS } from '@/constants/nigeria';



// Basic product information validation
export const basicInfoSchema = z.object({
  crop_type: z.enum(MAJOR_CROPS, {
    errorMap: () => ({ message: 'Please select a valid crop type' })
  }),
  variety: z.string()
    .min(1, 'Crop variety is required')
    .max(50, 'Variety name cannot exceed 50 characters'),
  title: z.string()
    .min(10, 'Product title must be at least 10 characters')
    .max(100, 'Product title cannot exceed 100 characters'),
  is_organic: z.boolean().default(false),
  quality_grade: z.enum(QUALITY_GRADES, {
    errorMap: () => ({ message: 'Please select a quality grade' })
  })
});

// Quantity and pricing validation
export const quantityPricingSchema = z.object({
  quantity_available: z.number()
    .min(0.1, 'Quantity must be greater than 0')
    .max(1000000, 'Quantity cannot exceed 1,000,000'),
  unit: z.enum(MEASUREMENT_UNITS, {
    errorMap: () => ({ message: 'Please select a valid unit' })
  }),
  price_per_unit: z.number()
    .min(100, 'Price must be at least ₦100')
    .max(1000000, 'Price cannot exceed ₦1,000,000'),
  minimum_order_quantity: z.number()
    .min(0.1, 'Minimum order quantity must be greater than 0')
    .optional(),
  bulk_discount_percentage: z.number()
    .min(0, 'Bulk discount cannot be negative')
    .max(50, 'Bulk discount cannot exceed 50%')
    .optional()
});

// Product details validation
export const productDetailsSchema = z.object({
  harvest_date: z.string()
    .refine((date) => {
      const harvestDate = new Date(date);
      const now = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
      
      return harvestDate <= maxFutureDate;
    }, 'Harvest date cannot be more than 1 year in the future')
    .optional(),
  available_from: z.string()
    .min(1, 'Available from date is required'),
  available_until: z.string()
    .min(1, 'Available until date is required'),
  storage_method: z.enum(STORAGE_METHODS, {
    errorMap: () => ({ message: 'Please select a storage method' })
  }),
  description: z.string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  certifications: z.array(z.enum(CERTIFICATIONS))
    .optional()
});

// Image validation
export const imageSchema = z.object({
  images: z.array(z.object({
    id: z.string(),
    file: z.instanceof(File),
    preview: z.string(),
    compressed: z.instanceof(File).optional(),
    uploadProgress: z.number().optional(),
    error: z.string().optional()
  }))
  .min(1, 'At least one product image is required')
  .max(8, 'Maximum 8 images allowed')
});

// Complete product validation schema
export const productSchema = basicInfoSchema
  .merge(quantityPricingSchema)
  .merge(productDetailsSchema)
  .merge(imageSchema)
  .refine((data) => {
    if (data.available_from && data.available_until) {
      const fromDate = new Date(data.available_from);
      const untilDate = new Date(data.available_until);
      return fromDate < untilDate;
    }
    return true;
  }, {
    message: 'Available until date must be after available from date',
    path: ['available_until']
  })
  .refine((data) => {
    if (data.minimum_order_quantity && data.quantity_available) {
      return data.minimum_order_quantity <= data.quantity_available;
    }
    return true;
  }, {
    message: 'Minimum order quantity cannot exceed total available quantity',
    path: ['minimum_order_quantity']
  });

// Draft product schema (more lenient)
export const draftProductSchema = basicInfoSchema
  .partial()
  .merge(quantityPricingSchema.partial())
  .merge(productDetailsSchema.partial())
  .merge(z.object({
    images: z.array(z.object({
      id: z.string(),
      file: z.instanceof(File),
      preview: z.string(),
      compressed: z.instanceof(File).optional(),
      uploadProgress: z.number().optional(),
      error: z.string().optional()
    })).optional()
  }));

// Product update schema
export const productUpdateSchema = productSchema.partial();

// Product search/filter schema
export const productFilterSchema = z.object({
  search: z.string().optional(),
  crop_type: z.enum(MAJOR_CROPS as [string, ...string[]]).optional(),
  quality_grade: z.enum(QUALITY_GRADES as [string, ...string[]]).optional(),
  status: z.enum(['active', 'inactive', 'draft', 'expired', 'pending', 'out_of_stock']).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  available_from: z.string().optional(),
  available_until: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort_by: z.enum(['created_at', 'updated_at', 'price_per_unit', 'quantity_available', 'title']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Product inquiry schema
export const productInquirySchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message cannot exceed 500 characters'),
  quantity_requested: z.number()
    .min(0.1, 'Quantity must be greater than 0')
    .optional(),
  preferred_delivery_date: z.string().optional()
});

// Type exports
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type QuantityPricingFormData = z.infer<typeof quantityPricingSchema>;
export type ProductDetailsFormData = z.infer<typeof productDetailsSchema>;
export type ImageFormData = z.infer<typeof imageSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type DraftProductFormData = z.infer<typeof draftProductSchema>;
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;
export type ProductFilterData = z.infer<typeof productFilterSchema>;
export type ProductInquiryFormData = z.infer<typeof productInquirySchema>;

// Validation helper functions
export function validateBasicInfo(data: unknown): { success: boolean; data?: BasicInfoFormData; errors?: string[] } {
  const result = basicInfoSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}

export function validateQuantityPricing(data: unknown): { success: boolean; data?: QuantityPricingFormData; errors?: string[] } {
  const result = quantityPricingSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}

export function validateProductDetails(data: unknown): { success: boolean; data?: ProductDetailsFormData; errors?: string[] } {
  const result = productDetailsSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}

export function validateCompleteProduct(data: unknown): { success: boolean; data?: ProductFormData; errors?: string[] } {
  const result = productSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}

export function validateDraftProduct(data: unknown): { success: boolean; data?: DraftProductFormData; errors?: string[] } {
  const result = draftProductSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
}
