'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Trash2, Share2, Filter, Grid, List, Search } from 'lucide-react';
import { SearchResult } from '../../../lib/search-utils';
import { useAuth } from '../../../lib/auth-store';
import { ProductCard } from '../../../components/buyer/product-card';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFavorites, setFilteredFavorites] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    // Filter favorites based on search query
    const filtered = favorites.filter(favorite =>
      favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.crop_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      favorite.farmer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFavorites(filtered);
  }, [favorites, searchQuery]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/buyer/favorites');
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.error('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch(`/api/buyer/favorites?product_id=${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from local state
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleShareFavorites = async () => {
    const favoritesUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Favorite Products',
          text: `Check out my favorite agricultural products on AgroConnect Nigeria`,
          url: favoritesUrl
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(favoritesUrl);
      // You could show a toast notification here
    }
  };

  const handlePreview = (productId: string) => {
    // This would open the product preview modal
    // For now, navigate to the product detail page
    window.open(`/buyer/products/${productId}`, '_blank');
  };

  const handleContact = (productId: string) => {
    // This would open the contact form
    alert('Contact functionality will be implemented in the next phase.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Favorite Products
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length} saved product{favorites.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareFavorites}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <Link
                href="/buyer/browse"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Search className="h-4 w-4" />
                Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Favorites List */}
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No favorites match your search
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse for more products.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Search
                </button>
              </>
            ) : favorites.length === 0 ? (
              <>
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start browsing products and save your favorites for easy access.
                </p>
                <Link
                  href="/buyer/browse"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Products
                </Link>
              </>
            ) : (
              <>
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No favorites found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Search
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredFavorites.length} of {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Products Grid/List */}
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            `}>
              {filteredFavorites.map((favorite) => (
                <div key={favorite.id} className="relative">
                  <ProductCard
                    product={favorite}
                    isFavorited={true}
                    onFavorite={() => handleRemoveFavorite(favorite.id)}
                    onPreview={() => handlePreview(favorite.id)}
                    onContact={() => handleContact(favorite.id)}
                    viewMode={viewMode}
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={handleShareFavorites}
                className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Share Favorites</span>
              </button>
              <Link
                href="/buyer/browse"
                className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Browse More</span>
              </Link>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to remove all favorites?')) {
                    // This would remove all favorites
                    alert('Bulk remove functionality will be implemented in the next phase.');
                  }
                }}
                className="flex items-center justify-center gap-2 p-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-600">Clear All</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
