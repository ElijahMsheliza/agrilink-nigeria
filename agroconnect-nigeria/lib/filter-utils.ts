import { SearchFilters } from './search-utils';
import { NIGERIAN_STATES, MAJOR_CROPS, QUALITY_GRADES } from '../constants/nigeria';

/**
 * Serialize filters to URL parameters
 */
export function serializeFilters(filters: SearchFilters): URLSearchParams {
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

  return params;
}

/**
 * Deserialize URL parameters to filters
 */
export function deserializeFilters(searchParams: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {
    page: 1,
    limit: 20,
    sortBy: 'date'
  };

  const query = searchParams.get('q');
  if (query) filters.query = query;

  const crops = searchParams.get('crops');
  if (crops) filters.cropTypes = crops.split(',').filter(Boolean);

  const quality = searchParams.get('quality');
  if (quality) filters.qualityGrades = quality.split(',').filter(Boolean);

  const minPrice = searchParams.get('min_price');
  if (minPrice) filters.minPrice = parseFloat(minPrice);

  const maxPrice = searchParams.get('max_price');
  if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

  const state = searchParams.get('state');
  if (state) filters.stateId = parseInt(state);

  const lga = searchParams.get('lga');
  if (lga) filters.lgaId = parseInt(lga);

  const radius = searchParams.get('radius');
  if (radius) filters.radius = parseFloat(radius);

  const availability = searchParams.get('availability') as 'now' | 'week' | 'month';
  if (availability) filters.availability = availability;

  const certifications = searchParams.get('certifications');
  if (certifications) filters.certifications = certifications.split(',').filter(Boolean);

  const harvest = searchParams.get('harvest') as '30days' | '3months' | '6months' | '1year';
  if (harvest) filters.harvestDate = harvest;

  const organic = searchParams.get('organic');
  if (organic === 'true') filters.isOrganic = true;

  const sort = searchParams.get('sort');
  if (sort) filters.sortBy = sort as any;

  const page = searchParams.get('page');
  if (page) filters.page = parseInt(page);

  return filters;
}

/**
 * Validate filter values
 */
export function validateFilters(filters: SearchFilters): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate price range
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    errors.push('Minimum price cannot be greater than maximum price');
  }

  if (filters.minPrice && filters.minPrice < 0) {
    errors.push('Minimum price cannot be negative');
  }

  if (filters.maxPrice && filters.maxPrice < 0) {
    errors.push('Maximum price cannot be negative');
  }

  // Validate crop types
  if (filters.cropTypes?.length) {
    const validCrops = MAJOR_CROPS.map(crop => crop.value);
    const invalidCrops = filters.cropTypes.filter(crop => !validCrops.includes(crop));
    if (invalidCrops.length > 0) {
      errors.push(`Invalid crop types: ${invalidCrops.join(', ')}`);
    }
  }

  // Validate quality grades
  if (filters.qualityGrades?.length) {
    const validGrades = QUALITY_GRADES.map(grade => grade.value);
    const invalidGrades = filters.qualityGrades.filter(grade => !validGrades.includes(grade));
    if (invalidGrades.length > 0) {
      errors.push(`Invalid quality grades: ${invalidGrades.join(', ')}`);
    }
  }

  // Validate radius
  if (filters.radius && (filters.radius < 0 || filters.radius > 1000)) {
    errors.push('Radius must be between 0 and 1000 km');
  }

  // Validate state
  if (filters.stateId) {
    const validStates = NIGERIAN_STATES.map(state => state.id);
    if (!validStates.includes(filters.stateId)) {
      errors.push('Invalid state selected');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get available filter options based on current data
 */
export function getFilterOptions() {
  return {
    cropTypes: MAJOR_CROPS,
    qualityGrades: QUALITY_GRADES,
    states: NIGERIAN_STATES,
    availability: [
      { value: 'now', label: 'Available Now' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' }
    ],
    certifications: [
      { value: 'organic', label: 'Organic Certified' },
      { value: 'nafdac', label: 'NAFDAC Approved' },
      { value: 'son', label: 'SON Certified' },
      { value: 'iso', label: 'ISO Certified' }
    ],
    harvestDate: [
      { value: '30days', label: 'Last 30 Days' },
      { value: '3months', label: 'Last 3 Months' },
      { value: '6months', label: 'Last 6 Months' },
      { value: '1year', label: 'Last Year' }
    ],
    sortOptions: [
      { value: 'date', label: 'Newest First' },
      { value: 'price_low', label: 'Price: Low to High' },
      { value: 'price_high', label: 'Price: High to Low' },
      { value: 'distance', label: 'Distance: Nearest First' },
      { value: 'rating', label: 'Rating: Highest First' }
    ],
    radiusOptions: [
      { value: 10, label: 'Within 10km' },
      { value: 25, label: 'Within 25km' },
      { value: 50, label: 'Within 50km' },
      { value: 100, label: 'Within 100km' },
      { value: 200, label: 'Within 200km' }
    ]
  };
}

/**
 * Clear all filters and return default state
 */
export function clearFilters(): SearchFilters {
  return {
    page: 1,
    limit: 20,
    sortBy: 'date'
  };
}

/**
 * Clear specific filter
 */
export function clearFilter(filters: SearchFilters, key: keyof SearchFilters): SearchFilters {
  const newFilters = { ...filters };
  delete newFilters[key];
  newFilters.page = 1; // Reset to first page when clearing filters
  return newFilters;
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: SearchFilters): number {
  let count = 0;
  
  if (filters.query) count++;
  if (filters.cropTypes?.length) count++;
  if (filters.qualityGrades?.length) count++;
  if (filters.minPrice || filters.maxPrice) count++;
  if (filters.stateId || filters.lgaId) count++;
  if (filters.radius) count++;
  if (filters.availability) count++;
  if (filters.certifications?.length) count++;
  if (filters.harvestDate) count++;
  if (filters.isOrganic) count++;

  return count;
}

/**
 * Generate filter summary text
 */
export function getFilterSummary(filters: SearchFilters): string {
  const parts: string[] = [];

  if (filters.query) parts.push(`"${filters.query}"`);
  if (filters.cropTypes?.length) parts.push(`${filters.cropTypes.length} crop type${filters.cropTypes.length > 1 ? 's' : ''}`);
  if (filters.qualityGrades?.length) parts.push(`${filters.qualityGrades.length} quality grade${filters.qualityGrades.length > 1 ? 's' : ''}`);
  if (filters.minPrice || filters.maxPrice) parts.push('price range');
  if (filters.stateId) parts.push('location filter');
  if (filters.radius) parts.push('distance filter');
  if (filters.availability) parts.push('availability filter');
  if (filters.certifications?.length) parts.push('certifications');
  if (filters.harvestDate) parts.push('harvest date');
  if (filters.isOrganic) parts.push('organic only');

  return parts.length > 0 ? parts.join(', ') : 'All products';
}

/**
 * Check if filters are at default state
 */
export function isDefaultFilters(filters: SearchFilters): boolean {
  const defaultFilters = clearFilters();
  
  return (
    !filters.query &&
    !filters.cropTypes?.length &&
    !filters.qualityGrades?.length &&
    !filters.minPrice &&
    !filters.maxPrice &&
    !filters.stateId &&
    !filters.lgaId &&
    !filters.radius &&
    !filters.availability &&
    !filters.certifications?.length &&
    !filters.harvestDate &&
    !filters.isOrganic &&
    filters.sortBy === defaultFilters.sortBy
  );
}

/**
 * Merge filters (useful for combining URL params with default filters)
 */
export function mergeFilters(baseFilters: SearchFilters, newFilters: Partial<SearchFilters>): SearchFilters {
  return {
    ...baseFilters,
    ...newFilters,
    page: 1 // Reset to first page when merging filters
  };
}

/**
 * Generate a shareable URL with current filters
 */
export function generateShareableURL(baseUrl: string, filters: SearchFilters): string {
  const params = serializeFilters(filters);
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
