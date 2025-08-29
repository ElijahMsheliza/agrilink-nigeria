import {
  buildSearchQuery,
  calculateDistance,
  formatSearchResults,
  highlightSearchTerms,
  generateSearchURL,
  validateFilters,
  getFilterOptions,
  clearFilters
} from '../../lib/search-utils';

describe('Search Utils', () => {
  describe('buildSearchQuery', () => {
    it('should build basic query with filters', () => {
      const filters = {
        query: 'rice',
        cropTypes: ['Rice', 'Maize'],
        minPrice: 1000,
        maxPrice: 5000,
        page: 1,
        limit: 20
      };

      const result = buildSearchQuery(filters);

      expect(result).toEqual({
        query: 'rice',
        cropTypes: ['Rice', 'Maize'],
        minPrice: 1000,
        maxPrice: 5000,
        page: 1,
        limit: 20,
        isActive: true,
        quantityAvailable: { gt: 0 }
      });
    });

    it('should handle availability filter', () => {
      const filters = {
        availability: 'now' as const,
        page: 1,
        limit: 20
      };

      const result = buildSearchQuery(filters);

      expect(result.availableFrom).toBeDefined();
      expect(result.availableFrom).toHaveProperty('lte');
    });

    it('should handle location-based filtering', () => {
      const filters = {
        buyerLat: 9.0820,
        buyerLng: 8.6753,
        radius: 50,
        page: 1,
        limit: 20
      };

      const result = buildSearchQuery(filters);

      expect(result.location).toEqual({
        lat: 9.0820,
        lng: 8.6753,
        radius: 50
      });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const lat1 = 9.0820;
      const lng1 = 8.6753;
      const lat2 = 6.5244;
      const lng2 = 3.3792;

      const distance = calculateDistance(lat1, lng1, lat2, lng2);

      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('should return 0 for same coordinates', () => {
      const lat = 9.0820;
      const lng = 8.6753;

      const distance = calculateDistance(lat, lng, lat, lng);

      expect(distance).toBe(0);
    });
  });

  describe('formatSearchResults', () => {
    it('should format products correctly', () => {
      const mockProducts = [
        {
          id: '1',
          title: 'Premium Rice',
          crop_type: 'Rice',
          variety: 'FARO 44',
          price_per_unit: 25000,
          quantity_available: 100,
          unit: 'bags',
          quality_grade: 'premium',
          is_organic: true,
          harvest_date: '2024-01-15',
          available_from: '2024-01-20',
          available_until: '2024-03-20',
          description: 'High quality rice',
          images: ['image1.jpg'],
          storage_method: 'Warehouse',
          farmer_profile: {
            user_id: 'farmer1',
            farm_name: 'Green Farm',
            latitude: 9.0820,
            longitude: 8.6753,
            certifications: ['Organic'],
            state: { name: 'Lagos' },
            lga: { name: 'Ikeja' },
            user: {
              full_name: 'John Farmer',
              is_verified: true
            }
          }
        }
      ];

      const buyerLocation = { lat: 9.0820, lng: 8.6753 };
      const result = formatSearchResults(mockProducts, buyerLocation);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '1',
        title: 'Premium Rice',
        cropType: 'Rice',
        variety: 'FARO 44',
        pricePerUnit: 25000,
        quantityAvailable: 100,
        unit: 'bags',
        qualityGrade: 'premium',
        isOrganic: true,
        farmer: {
          name: 'John Farmer',
          farmName: 'Green Farm',
          isVerified: true,
          state: 'Lagos',
          lga: 'Ikeja'
        }
      });
      expect(result[0].distance).toBeDefined();
    });
  });

  describe('highlightSearchTerms', () => {
    it('should highlight search terms in text', () => {
      const text = 'Premium Rice from Nigeria';
      const query = 'rice';

      const result = highlightSearchTerms(text, query);

      expect(result).toContain('<mark>Rice</mark>');
    });

    it('should handle case insensitive highlighting', () => {
      const text = 'Premium RICE from Nigeria';
      const query = 'rice';

      const result = highlightSearchTerms(text, query);

      expect(result).toContain('<mark>RICE</mark>');
    });

    it('should return original text if no query', () => {
      const text = 'Premium Rice from Nigeria';
      const query = '';

      const result = highlightSearchTerms(text, query);

      expect(result).toBe(text);
    });
  });

  describe('generateSearchURL', () => {
    it('should generate URL with filters', () => {
      const filters = {
        query: 'rice',
        cropTypes: ['Rice'],
        minPrice: 1000,
        maxPrice: 5000,
        stateId: 25,
        radius: 50,
        sortBy: 'price_asc' as const
      };

      const result = generateSearchURL(filters);

      expect(result).toContain('q=rice');
      expect(result).toContain('crops=Rice');
      expect(result).toContain('min_price=1000');
      expect(result).toContain('max_price=5000');
      expect(result).toContain('state=25');
      expect(result).toContain('radius=50');
      expect(result).toContain('sort=price_asc');
    });

    it('should return empty string for no filters', () => {
      const filters = {};

      const result = generateSearchURL(filters);

      expect(result).toBe('');
    });
  });

  describe('validateFilters', () => {
    it('should validate correct filters', () => {
      const filters = {
        minPrice: 1000,
        maxPrice: 5000,
        radius: 50,
        buyerLat: 9.0820,
        buyerLng: 8.6753
      };

      const result = validateFilters(filters);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid price range', () => {
      const filters = {
        minPrice: 5000,
        maxPrice: 1000
      };

      const result = validateFilters(filters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Minimum price cannot be greater than maximum price');
    });

    it('should detect invalid radius', () => {
      const filters = {
        radius: 1000
      };

      const result = validateFilters(filters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search radius must be between 1 and 500 kilometers');
    });

    it('should detect invalid coordinates', () => {
      const filters = {
        buyerLat: 100,
        buyerLng: 200
      };

      const result = validateFilters(filters);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid latitude value');
      expect(result.errors).toContain('Invalid longitude value');
    });
  });

  describe('getFilterOptions', () => {
    it('should return all filter options', () => {
      const options = getFilterOptions();

      expect(options.cropTypes).toContain('Rice');
      expect(options.cropTypes).toContain('Maize');
      expect(options.qualityGrades).toContain('premium');
      expect(options.availability).toHaveLength(3);
      expect(options.certifications).toContain('Organic');
      expect(options.harvestDate).toHaveLength(3);
      expect(options.sortOptions).toHaveLength(5);
      expect(options.radiusOptions).toHaveLength(6);
    });
  });

  describe('clearFilters', () => {
    it('should return default filters', () => {
      const result = clearFilters();

      expect(result).toEqual({
        page: 1,
        limit: 20,
        sortBy: 'date'
      });
    });
  });
});
