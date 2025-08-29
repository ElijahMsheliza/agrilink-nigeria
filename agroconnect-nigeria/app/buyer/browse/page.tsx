'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchHeader } from '../../../components/buyer/search-header';
import { ProductGrid } from '../../../components/buyer/product-grid';
import { FilterSidebar } from '../../../components/buyer/filter-sidebar';
import { ProductPreviewModal } from '../../../components/buyer/product-preview-modal';
import { SearchFilters, SearchResult } from '../../../lib/search-utils';
import { useAuth } from '../../../lib/auth-store';

export default function BrowseProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<SearchResult[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [currentSort, setCurrentSort] = useState('date');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<SearchResult | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    page: 1,
    limit: 20,
    sortBy: 'date'
  });

  // Parse URL parameters on mount and when searchParams change
  useEffect(() => {
    const newFilters: SearchFilters = {
      page: 1,
      limit: 20,
      sortBy: 'date'
    };

    // Parse search parameters
    const query = searchParams.get('q');
    if (query) newFilters.query = query;

    const cropTypes = searchParams.get('crops');
    if (cropTypes) newFilters.cropTypes = cropTypes.split(',');

    const qualityGrades = searchParams.get('quality');
    if (qualityGrades) newFilters.qualityGrades = qualityGrades.split(',');

    const minPrice = searchParams.get('min_price');
    if (minPrice) newFilters.minPrice = parseFloat(minPrice);

    const maxPrice = searchParams.get('max_price');
    if (maxPrice) newFilters.maxPrice = parseFloat(maxPrice);

    const stateId = searchParams.get('state');
    if (stateId) newFilters.stateId = parseInt(stateId);

    const lgaId = searchParams.get('lga');
    if (lgaId) newFilters.lgaId = parseInt(lgaId);

    const radius = searchParams.get('radius');
    if (radius) newFilters.radius = parseFloat(radius);

    const availability = searchParams.get('availability') as 'now' | 'week' | 'month';
    if (availability) newFilters.availability = availability;

    const certifications = searchParams.get('certifications');
    if (certifications) newFilters.certifications = certifications.split(',');

    const harvestDate = searchParams.get('harvest') as '30days' | '3months' | '6months';
    if (harvestDate) newFilters.harvestDate = harvestDate;

    const isOrganic = searchParams.get('organic');
    if (isOrganic === 'true') newFilters.isOrganic = true;

    const sortBy = searchParams.get('sort');
    if (sortBy) newFilters.sortBy = sortBy as any;

    const page = searchParams.get('page');
    if (page) newFilters.page = parseInt(page);

    setFilters(newFilters);
    setCurrentPage(newFilters.page || 1);
    setCurrentSort(newFilters.sortBy || 'date');
  }, [searchParams]);

  // Fetch products when filters change
  const fetchProducts = useCallback(async (searchFilters: SearchFilters, append = false) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      // Add filter parameters
      if (searchFilters.query) params.set('q', searchFilters.query);
      if (searchFilters.cropTypes?.length) params.set('crop_types', searchFilters.cropTypes.join(','));
      if (searchFilters.qualityGrades?.length) params.set('quality_grades', searchFilters.qualityGrades.join(','));
      if (searchFilters.minPrice) params.set('min_price', searchFilters.minPrice.toString());
      if (searchFilters.maxPrice) params.set('max_price', searchFilters.maxPrice.toString());
      if (searchFilters.stateId) params.set('state_id', searchFilters.stateId.toString());
      if (searchFilters.lgaId) params.set('lga_id', searchFilters.lgaId.toString());
      if (searchFilters.radius) params.set('radius', searchFilters.radius.toString());
      if (searchFilters.buyerLat) params.set('buyer_lat', searchFilters.buyerLat.toString());
      if (searchFilters.buyerLng) params.set('buyer_lng', searchFilters.buyerLng.toString());
      if (searchFilters.availability) params.set('availability', searchFilters.availability);
      if (searchFilters.certifications?.length) params.set('certifications', searchFilters.certifications.join(','));
      if (searchFilters.harvestDate) params.set('harvest_date', searchFilters.harvestDate);
      if (searchFilters.isOrganic) params.set('is_organic', 'true');
      if (searchFilters.sortBy) params.set('sort_by', searchFilters.sortBy);
      if (searchFilters.page) params.set('page', searchFilters.page.toString());
      if (searchFilters.limit) params.set('limit', searchFilters.limit.toString());

      const response = await fetch(`/api/buyer/products/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      if (append) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }
      
      setTotalResults(data.pagination.total);
      setHasMore(data.pagination.page < data.pagination.totalPages);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/buyer/favorites');
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = new Set(data.favorites.map((fav: any) => fav.productId));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  }, [user]);

  // Load products when filters change
  useEffect(() => {
    fetchProducts(filters, false);
  }, [filters, fetchProducts]);

  // Load favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFilters) => {
    const updatedFilters = { ...newFilters, page: 1 };
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    
    if (updatedFilters.query) params.set('q', updatedFilters.query);
    if (updatedFilters.cropTypes?.length) params.set('crops', updatedFilters.cropTypes.join(','));
    if (updatedFilters.qualityGrades?.length) params.set('quality', updatedFilters.qualityGrades.join(','));
    if (updatedFilters.minPrice) params.set('min_price', updatedFilters.minPrice.toString());
    if (updatedFilters.maxPrice) params.set('max_price', updatedFilters.maxPrice.toString());
    if (updatedFilters.stateId) params.set('state', updatedFilters.stateId.toString());
    if (updatedFilters.lgaId) params.set('lga', updatedFilters.lgaId.toString());
    if (updatedFilters.radius) params.set('radius', updatedFilters.radius.toString());
    if (updatedFilters.availability) params.set('availability', updatedFilters.availability);
    if (updatedFilters.certifications?.length) params.set('certifications', updatedFilters.certifications.join(','));
    if (updatedFilters.harvestDate) params.set('harvest', updatedFilters.harvestDate);
    if (updatedFilters.isOrganic) params.set('organic', 'true');
    if (updatedFilters.sortBy) params.set('sort', updatedFilters.sortBy);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/buyer/browse';
    router.push(newUrl);
  };

  // Handle search
  const handleSearch = (query: string) => {
    handleFiltersChange({ ...filters, query });
  };

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    const updatedFilters = { ...filters, sortBy: sortBy as any, page: 1 };
    setFilters(updatedFilters);
    setCurrentSort(sortBy);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sortBy);
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list' | 'map') => {
    setViewMode(mode);
  };

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const updatedFilters = { ...filters, page: nextPage };
    setCurrentPage(nextPage);
    fetchProducts(updatedFilters, true);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async (productId: string, isFavorite: boolean) => {
    try {
      const method = isFavorite ? 'POST' : 'DELETE';
      const response = await fetch('/api/buyer/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isFavorite) {
            newFavorites.add(productId);
          } else {
            newFavorites.delete(productId);
          }
          return newFavorites;
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle product preview
  const handleProductPreview = (product: SearchResult) => {
    setPreviewProduct(product);
  };

  // Handle preview modal close
  const handlePreviewClose = () => {
    setPreviewProduct(null);
  };

  // Handle view details
  const handleViewDetails = (productId: string) => {
    router.push(`/buyer/products/${productId}`);
  };

  // Handle contact farmer
  const handleContactFarmer = (productId: string) => {
    // This will be implemented in the next phase
    alert('Contact functionality will be implemented in the next phase.');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to browse products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <SearchHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterSidebarOpen}
              onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              totalResults={totalResults}
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full">
            <FilterSidebar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={isFilterSidebarOpen}
              onToggle={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              totalResults={totalResults}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              onFavorite={handleFavoriteToggle}
              onPreview={handleProductPreview}
              favorites={favorites}
              onSortChange={handleSortChange}
              onViewModeChange={handleViewModeChange}
              currentSort={currentSort}
              currentViewMode={viewMode}
              totalResults={totalResults}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
            />
          </div>
        </div>
      </div>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        isOpen={!!previewProduct}
        onClose={handlePreviewClose}
        onFavorite={handleFavoriteToggle}
        isFavorited={previewProduct ? favorites.has(previewProduct.id) : false}
        onViewDetails={handleViewDetails}
        onContactFarmer={handleContactFarmer}
      />
    </div>
  );
}
