'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, MapPin, Star, Calendar, Package, Share2 } from 'lucide-react';
import { SearchResult } from '../../lib/search-utils';
import { formatDistance, formatPrice } from '../../lib/product-utils';

interface ProductPreviewModalProps {
  product: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onFavorite: (productId: string) => void;
  isFavorited: boolean;
  onViewDetails: (productId: string) => void;
  onContactFarmer: (productId: string) => void;
}

export function ProductPreviewModal({
  product,
  isOpen,
  onClose,
  onFavorite,
  isFavorited,
  onViewDetails,
  onContactFarmer
}: ProductPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = product.images || [];
  const currentImage = images[currentImageIndex] || '/placeholder-product.jpg';

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.crop_type} from ${product.farmer_name}`,
          url: window.location.origin + `/buyer/products/${product.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const url = window.location.origin + `/buyer/products/${product.id}`;
      await navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {product.title}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share product"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Image Gallery */}
            <div className="relative bg-gray-100">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-64 object-cover"
              />
              
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-4">
              {/* Title and Favorite */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-600 capitalize">
                    {product.crop_type}
                  </p>
                </div>
                <button
                  onClick={() => onFavorite(product.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorited
                      ? 'text-red-500 bg-red-50 hover:bg-red-100'
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Price and Quantity */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(product.price_per_unit)}
                  </p>
                  <p className="text-sm text-gray-600">
                    per {product.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {product.quantity_available} {product.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    available
                  </p>
                </div>
              </div>

              {/* Quality and Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.quality_grade === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                    product.quality_grade === 'grade_a' ? 'bg-green-100 text-green-800' :
                    product.quality_grade === 'grade_b' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.quality_grade.replace('_', ' ').toUpperCase()}
                  </span>
                  {product.is_organic && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ORGANIC
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {product.farmer_rating || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {product.farmer_name}
                  </h4>
                  <span className="text-sm text-gray-600">
                    {product.farmer_verified ? '✓ Verified' : 'Unverified'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{product.farmer_location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{product.farmer_products_count} products</span>
                  </div>
                </div>
              </div>

              {/* Distance and Harvest Date */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {product.distance ? `${formatDistance(product.distance)} away` : 'Distance unavailable'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Harvested {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3">
              <button
                onClick={() => onViewDetails(product.id)}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                View Full Details
              </button>
              <button
                onClick={() => onContactFarmer(product.id)}
                className="flex-1 bg-white text-green-600 border border-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
