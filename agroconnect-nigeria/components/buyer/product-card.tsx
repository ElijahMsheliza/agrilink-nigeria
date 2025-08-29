'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, Calendar, Package, Eye, MessageCircle } from 'lucide-react';
import { SearchResult } from '../../lib/search-utils';
import { formatDistance } from '../../lib/location-utils';

interface ProductCardProps {
  product: SearchResult;
  onFavorite?: (productId: string, isFavorite: boolean) => void;
  onPreview?: (product: SearchResult) => void;
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ 
  product, 
  onFavorite, 
  onPreview, 
  isFavorite = false,
  viewMode = 'grid'
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Format price in Nigerian Naira
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get quality grade display text
  const getQualityGradeText = (grade?: string) => {
    switch (grade) {
      case 'premium': return 'Premium';
      case 'grade_a': return 'Grade A';
      case 'grade_b': return 'Grade B';
      case 'grade_c': return 'Grade C';
      default: return 'Standard';
    }
  };

  // Get quality grade color
  const getQualityGradeColor = (grade?: string) => {
    switch (grade) {
      case 'premium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'grade_a': return 'bg-green-100 text-green-800 border-green-200';
      case 'grade_b': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'grade_c': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get availability status
  const getAvailabilityStatus = () => {
    const now = new Date();
    const availableFrom = new Date(product.availableFrom);
    const availableUntil = product.availableUntil ? new Date(product.availableUntil) : null;

    if (availableFrom > now) {
      return { status: 'pending', text: 'Coming Soon', color: 'bg-blue-100 text-blue-800' };
    }

    if (availableUntil && availableUntil < now) {
      return { status: 'expired', text: 'Expired', color: 'bg-red-100 text-red-800' };
    }

    if (product.quantityAvailable < 10) {
      return { status: 'limited', text: 'Limited Stock', color: 'bg-orange-100 text-orange-800' };
    }

    return { status: 'available', text: 'Available', color: 'bg-green-100 text-green-800' };
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!onFavorite) return;
    
    setIsLoading(true);
    try {
      await onFavorite(product.id, !isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preview
  const handlePreview = () => {
    if (onPreview) {
      onPreview(product);
    }
  };

  const availability = getAvailabilityStatus();
  const primaryImage = product.images?.[0] || '/placeholder-product.jpg';

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={imageError ? '/placeholder-product.jpg' : primaryImage}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
            {product.isOrganic && (
              <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                Organic
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {product.cropType}
                  {product.variety && ` • ${product.variety}`}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handlePreview}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>{product.quantityAvailable} {product.unit}</span>
              </div>
              {product.distance && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{formatDistance(product.distance)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  {formatPrice(product.pricePerUnit)}
                </span>
                <span className="text-sm text-gray-500">per {product.unit.slice(0, -1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityGradeColor(product.qualityGrade)}`}>
                  {getQualityGradeText(product.qualityGrade)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
                  {availability.text}
                </span>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {product.farmer.isVerified && (
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {product.farmer.name}
                  </span>
                </div>
                {product.farmer.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{product.farmer.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <Link
                href={`/buyer/products/${product.id}`}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="relative aspect-square">
        <Image
          src={imageError ? '/placeholder-product.jpg' : primaryImage}
          alt={product.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOrganic && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Organic
            </div>
          )}
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getQualityGradeColor(product.qualityGrade)}`}>
            {getQualityGradeText(product.qualityGrade)}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'text-red-500 bg-white shadow-md' 
              : 'text-gray-400 bg-white/80 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Availability Status */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
            {availability.text}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-600">
            {product.cropType}
            {product.variety && ` • ${product.variety}`}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.pricePerUnit)}
            </span>
            <span className="text-xs text-gray-500 ml-1">per {product.unit.slice(0, -1)}</span>
          </div>
          <div className="text-xs text-gray-600">
            {product.quantityAvailable} {product.unit}
          </div>
        </div>

        {/* Location and Distance */}
        {product.distance && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <MapPin className="h-3 w-3" />
            <span>{formatDistance(product.distance)} away</span>
          </div>
        )}

        {/* Farmer Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {product.farmer.isVerified && (
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <span className="text-xs font-medium text-gray-900 truncate">
                {product.farmer.name}
              </span>
            </div>
            {product.farmer.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{product.farmer.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Eye className="h-3 w-3" />
            Preview
          </button>
          <Link
            href={`/buyer/products/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <MessageCircle className="h-3 w-3" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
