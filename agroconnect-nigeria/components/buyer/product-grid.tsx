'use client';

import React, { useState } from 'react';
import { Grid, List, Map, ChevronDown, Filter } from 'lucide-react';
import { ProductCard } from './product-card';
import { SearchResult } from '../../lib/search-utils';
import { Button } from '../ui/button';

interface ProductGridProps {
  products: SearchResult[];
  isLoading?: boolean;
  onFavorite?: (productId: string, isFavorite: boolean) => Promise<void>;
  onPreview?: (product: SearchResult) => void;
  favorites?: Set<string>;
  onSortChange?: (sortBy: string) => void;
  onViewModeChange?: (mode: 'grid' | 'list' | 'map') => void;
  currentSort?: string;
  currentViewMode?: 'grid' | 'list' | 'map';
  totalResults?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function ProductGrid({
  products,
  isLoading = false,
  onFavorite,
  onPreview,
  favorites = new Set(),
  onSortChange,
  onViewModeChange,
  currentSort = 'date',
  currentViewMode = 'grid',
  totalResults = 0,
  onLoadMore,
  hasMore = false
}: ProductGridProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'date', label: 'Latest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'distance', label: 'Distance' },
    { value: 'rating', label: 'Farmer Rating' }
  ];

  const handleSortChange = (sortBy: string) => {
    if (onSortChange) {
      onSortChange(sortBy);
    }
    setShowSortDropdown(false);
  };

  const handleViewModeChange = (mode: 'grid' | 'list' | 'map') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

  const handleFavorite = async (productId: string, isFavorite: boolean) => {
    if (onFavorite) {
      await onFavorite(productId, isFavorite);
    }
  };

  const handlePreview = (product: SearchResult) => {
    if (onPreview) {
      onPreview(product);
    }
  };

  // Loading skeleton cards
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1" />
              <div className="h-8 bg-gray-200 rounded flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Grid className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Try adjusting your search criteria or filters to find what you're looking for.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Rice
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Maize
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Cassava
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          Yam
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Results count */}
        <div className="text-sm text-gray-600">
          {isLoading ? (
            'Loading products...'
          ) : (
            <>
              {totalResults} product{totalResults !== 1 ? 's' : ''} found
              {products.length > 0 && (
                <span className="text-gray-400 ml-2">
                  (showing {products.length})
                </span>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2"
            >
              <span className="text-sm">
                {sortOptions.find(option => option.value === currentSort)?.label || 'Sort by'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      currentSort === option.value
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex border border-gray-200 rounded-lg">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                currentViewMode === 'grid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 border-l border-r border-gray-200 transition-colors ${
                currentViewMode === 'list'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('map')}
              className={`p-2 rounded-r-lg transition-colors ${
                currentViewMode === 'map'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Grid/List View */}
          {currentViewMode !== 'map' && (
            <div className={
              currentViewMode === 'list'
                ? 'space-y-4'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            }>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavorite={handleFavorite}
                  onPreview={handlePreview}
                  isFavorite={favorites.has(product.id)}
                  viewMode={currentViewMode}
                />
              ))}
            </div>
          )}

          {/* Map View Placeholder */}
          {currentViewMode === 'map' && (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
              <p className="text-gray-600">
                Map view will show products by location. Coming soon!
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && onLoadMore && (
            <div className="text-center pt-8">
              <Button
                onClick={onLoadMore}
                variant="outline"
                size="lg"
                className="px-8"
              >
                Load More Products
              </Button>
            </div>
          )}
        </>
      )}

      {/* Backdrop for dropdown */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
}
