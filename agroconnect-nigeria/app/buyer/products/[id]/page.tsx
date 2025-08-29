'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProductDetails } from '../../../../components/buyer/product-details';
import { SearchResult } from '../../../../lib/search-utils';
import { useAuth } from '../../../../lib/auth-store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<SearchResult | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SearchResult[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      checkFavoriteStatus();
    }
  }, [productId, user]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/buyer/products/${productId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product details');
        }
        return;
      }

      const data = await response.json();
      setProduct(data.product);
      setRelatedProducts(data.relatedProducts || []);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setError('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/buyer/favorites');
      if (response.ok) {
        const data = await response.json();
        const favoriteIds = data.favorites.map((fav: any) => fav.product_id);
        setIsFavorited(favoriteIds.includes(productId));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleFavorite = async (productId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/buyer/favorites?product_id=${productId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/buyer/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId }),
        });
        
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleContactFarmer = (productId: string) => {
    // For now, just show an alert. This will be replaced with actual contact functionality
    alert('Contact functionality will be implemented in the next phase. This would open a contact form or messaging system.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/buyer/browse')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/buyer/browse')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      relatedProducts={relatedProducts}
      isFavorited={isFavorited}
      onFavorite={handleFavorite}
      onContactFarmer={handleContactFarmer}
    />
  );
}
