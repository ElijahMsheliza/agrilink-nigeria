'use client';

import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Star, 
  Calendar, 
  Package, 
  Share2, 
  Phone, 
  Mail, 
  Globe,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Leaf,
  Award
} from 'lucide-react';
import { SearchResult } from '../../lib/search-utils';
import { formatDistance, formatPrice } from '../../lib/product-utils';
import { ProductCard } from './product-card';

interface ProductDetailsProps {
  product: SearchResult;
  relatedProducts: SearchResult[];
  isFavorited: boolean;
  onFavorite: (productId: string) => void;
  onContactFarmer: (productId: string) => void;
}

export function ProductDetails({
  product,
  relatedProducts,
  isFavorited,
  onFavorite,
  onContactFarmer
}: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'farmer' | 'location' | 'reviews'>('overview');

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
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'grade_a': return 'bg-green-100 text-green-800';
      case 'grade_b': return 'bg-blue-100 text-blue-800';
      case 'grade_c': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'specifications', label: 'Specifications', icon: Award },
    { id: 'farmer', label: 'Farmer Info', icon: Shield },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/buyer/browse" className="text-gray-700 hover:text-green-600">
              Browse Products
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-500">{product.crop_type}</span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-96 object-cover"
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-gray-600 capitalize mb-2">
                {product.crop_type}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{product.farmer_location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{product.distance ? `${formatDistance(product.distance)} away` : 'Distance unavailable'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share product"
              >
                <Share2 className="h-5 w-5" />
              </button>
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
          </div>

          {/* Price and Quantity */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(product.price_per_unit)}
                </p>
                <p className="text-gray-600">per {product.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">
                  {product.quantity_available} {product.unit}
                </p>
                <p className="text-gray-600">available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getQualityColor(product.quality_grade)}`}>
                  {product.quality_grade.replace('_', ' ').toUpperCase()}
                </span>
                {product.is_organic && (
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                    <Leaf className="h-4 w-4" />
                    ORGANIC
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium text-gray-900">
                  {product.farmer_rating || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => onContactFarmer(product.id)}
              className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Contact Farmer
            </button>
            <button className="flex-1 bg-white text-green-600 border border-green-600 py-4 px-6 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
              <Truck className="h-5 w-5" />
              Get Quote
            </button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Harvest Date</p>
                <p className="text-sm text-gray-600">
                  {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Minimum Order</p>
                <p className="text-sm text-gray-600">1 {product.unit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Freshly harvested {product.crop_type}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Quality grade: {product.quality_grade.replace('_', ' ').toUpperCase()}</span>
                  </li>
                  {product.is_organic && (
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Certified organic product</span>
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Available for immediate purchase</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Product Details</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Crop Type</dt>
                      <dd className="font-medium text-gray-900 capitalize">{product.crop_type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Quality Grade</dt>
                      <dd className="font-medium text-gray-900">{product.quality_grade.replace('_', ' ').toUpperCase()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Unit</dt>
                      <dd className="font-medium text-gray-900">{product.unit}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Organic</dt>
                      <dd className="font-medium text-gray-900">{product.is_organic ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Pricing & Availability</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Price per Unit</dt>
                      <dd className="font-medium text-gray-900">{formatPrice(product.price_per_unit)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Available Quantity</dt>
                      <dd className="font-medium text-gray-900">{product.quantity_available} {product.unit}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Harvest Date</dt>
                      <dd className="font-medium text-gray-900">
                        {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'Recently'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'farmer' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{product.farmer_name}</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.farmer_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.farmer_verified ? '✓ Verified Farmer' : 'Unverified'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Farmer Information</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Location</dt>
                        <dd className="font-medium text-gray-900">{product.farmer_location}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Rating</dt>
                        <dd className="font-medium text-gray-900 flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          {product.farmer_rating || 'N/A'}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Products</dt>
                        <dd className="font-medium text-gray-900">{product.farmer_products_count} listed</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Contact Options</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        <Phone className="h-4 w-4" />
                        Call Farmer
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 bg-white text-green-600 border border-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors">
                        <Mail className="h-4 w-4" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location & Logistics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Location Details</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Farm Location</dt>
                        <dd className="font-medium text-gray-900">{product.farmer_location}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Distance</dt>
                        <dd className="font-medium text-gray-900">
                          {product.distance ? formatDistance(product.distance) : 'Unavailable'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Transportation</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Local pickup available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Delivery within 50km</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-gray-700">Bulk shipping available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">
                  Be the first to review this product after your purchase.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                isFavorited={false}
                onFavorite={() => {}}
                onPreview={() => {}}
                onContact={() => {}}
                viewMode="grid"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
