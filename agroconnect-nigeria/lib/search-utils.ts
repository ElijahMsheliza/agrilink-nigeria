// Search utilities for buyer product discovery system

export interface SearchFilters {
  query?: string;
  cropTypes?: string[];
  qualityGrades?: string[];
  minPrice?: number;
  maxPrice?: number;
  stateId?: number;
  lgaId?: number;
  radius?: number;
  buyerLat?: number;
  buyerLng?: number;
  availability?: 'now' | 'week' | 'month';
  certifications?: string[];
  harvestDate?: '30days' | '3months' | '6months';
  isOrganic?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'distance' | 'date' | 'rating';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  cropType: string;
  variety?: string;
  pricePerUnit: number;
  quantityAvailable: number;
  unit: string;
  qualityGrade?: string;
  isOrganic: boolean;
  harvestDate?: string;
  availableFrom: string;
  availableUntil?: string;
  description?: string;
  images?: string[];
  distance?: number;
  farmer: {
    id: string;
    name: string;
    farmName?: string;
    rating?: number;
    isVerified: boolean;
    state: string;
    lga: string;
  };
  certifications?: string[];
  storageMethod?: string;
}

export function buildSearchQuery(filters: SearchFilters) {
  const query: any = {
    ...filters,
    isActive: true,
    quantityAvailable: { gt: 0 }
  };

  // Handle text search
  if (filters.query) {
    query.search = filters.query;
  }

  // Handle location-based filtering
  if (filters.buyerLat && filters.buyerLng && filters.radius) {
    query.location = {
      lat: filters.buyerLat,
      lng: filters.buyerLng,
      radius: filters.radius
    };
  }

  // Handle availability filtering
  if (filters.availability) {
    const now = new Date();
    switch (filters.availability) {
      case 'now':
        query.availableFrom = { lte: now.toISOString() };
        break;
      case 'week':
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        query.availableFrom = { lte: weekFromNow.toISOString() };
        break;
      case 'month':
        const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        query.availableFrom = { lte: monthFromNow.toISOString() };
        break;
    }
  }

  // Handle harvest date filtering
  if (filters.harvestDate) {
    const now = new Date();
    let daysAgo: number;
    
    switch (filters.harvestDate) {
      case '30days':
        daysAgo = 30;
        break;
      case '3months':
        daysAgo = 90;
        break;
      case '6months':
        daysAgo = 180;
        break;
      default:
        daysAgo = 30;
    }
    
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    query.harvestDate = { gte: cutoffDate.toISOString() };
  }

  return query;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatSearchResults(products: any[], buyerLocation?: { lat: number; lng: number }): SearchResult[] {
  return products.map(product => ({
    id: product.id,
    title: product.title,
    cropType: product.crop_type,
    variety: product.variety,
    pricePerUnit: product.price_per_unit,
    quantityAvailable: product.quantity_available,
    unit: product.unit,
    qualityGrade: product.quality_grade,
    isOrganic: product.is_organic,
    harvestDate: product.harvest_date,
    availableFrom: product.available_from,
    availableUntil: product.available_until,
    description: product.description,
    images: product.images || [],
    distance: buyerLocation && product.farmer_profile?.latitude && product.farmer_profile?.longitude
      ? calculateDistance(
          buyerLocation.lat,
          buyerLocation.lng,
          product.farmer_profile.latitude,
          product.farmer_profile.longitude
        )
      : undefined,
    farmer: {
      id: product.farmer_profile?.user_id || '',
      name: product.farmer_profile?.user?.full_name || 'Unknown Farmer',
      farmName: product.farmer_profile?.farm_name,
      rating: product.farmer_profile?.rating || 0,
      isVerified: product.farmer_profile?.user?.is_verified || false,
      state: product.farmer_profile?.state?.name || '',
      lga: product.farmer_profile?.lga?.name || ''
    },
    certifications: product.farmer_profile?.certifications || [],
    storageMethod: product.storage_method
  }));
}

export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !text) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function generateSearchURL(filters: SearchFilters): string {
  const params = new URLSearchParams();
  
  if (filters.query) params.set('q', filters.query);
  if (filters.cropTypes?.length) params.set('crops', filters.cropTypes.join(','));
  if (filters.qualityGrades?.length) params.set('quality', filters.qualityGrades.join(','));
  if (filters.minPrice) params.set('min_price', filters.minPrice.toString());
  if (filters.maxPrice) params.set('max_price', filters.maxPrice.toString());
  if (filters.stateId) params.set('state', filters.stateId.toString());
  if (filters.lgaId) params.set('lga', filters.lgaId.toString());
  if (filters.radius) params.set('radius', filters.radius.toString());
  if (filters.availability) params.set('availability', filters.availability);
  if (filters.certifications?.length) params.set('certifications', filters.certifications.join(','));
  if (filters.harvestDate) params.set('harvest', filters.harvestDate);
  if (filters.isOrganic) params.set('organic', 'true');
  if (filters.sortBy) params.set('sort', filters.sortBy);
  if (filters.page && filters.page > 1) params.set('page', filters.page.toString());
  
  return params.toString() ? `?${params.toString()}` : '';
}

export function serializeFilters(filters: SearchFilters): string {
  return JSON.stringify(filters);
}

export function deserializeFilters(serialized: string): SearchFilters {
  try {
    return JSON.parse(serialized);
  } catch {
    return {};
  }
}

export function validateFilters(filters: SearchFilters): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    errors.push('Minimum price cannot be greater than maximum price');
  }
  
  if (filters.radius && (filters.radius < 1 || filters.radius > 500)) {
    errors.push('Search radius must be between 1 and 500 kilometers');
  }
  
  if (filters.buyerLat && (filters.buyerLat < -90 || filters.buyerLat > 90)) {
    errors.push('Invalid latitude value');
  }
  
  if (filters.buyerLng && (filters.buyerLng < -180 || filters.buyerLng > 180)) {
    errors.push('Invalid longitude value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getFilterOptions() {
  return {
    cropTypes: [
      'Rice', 'Maize', 'Cassava', 'Yam', 'Plantain', 'Cocoa', 'Palm Oil',
      'Sorghum', 'Millet', 'Groundnut', 'Soybean', 'Cowpea', 'Sweet Potato',
      'Irish Potato', 'Tomato', 'Pepper', 'Onion', 'Garlic', 'Ginger'
    ],
    qualityGrades: ['premium', 'grade_a', 'grade_b', 'grade_c'],
    availability: [
      { value: 'now', label: 'Available Now' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' }
    ],
    certifications: ['Organic', 'NAFDAC', 'SON', 'ISO', 'HACCP'],
    harvestDate: [
      { value: '30days', label: 'Last 30 Days' },
      { value: '3months', label: 'Last 3 Months' },
      { value: '6months', label: 'Last 6 Months' }
    ],
    sortOptions: [
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'distance', label: 'Distance' },
      { value: 'date', label: 'Harvest Date' },
      { value: 'rating', label: 'Farmer Rating' }
    ],
    radiusOptions: [
      { value: 10, label: 'Within 10km' },
      { value: 25, label: 'Within 25km' },
      { value: 50, label: 'Within 50km' },
      { value: 100, label: 'Within 100km' },
      { value: 250, label: 'Within 250km' },
      { value: 500, label: 'Within 500km' }
    ]
  };
}

export function clearFilters(): SearchFilters {
  return {
    page: 1,
    limit: 20,
    sortBy: 'date'
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
