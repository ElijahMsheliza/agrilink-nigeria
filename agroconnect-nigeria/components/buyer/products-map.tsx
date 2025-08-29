'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { SearchResult } from '../../lib/search-utils';

interface ProductsMapProps {
  products: SearchResult[];
  onProductClick: (product: SearchResult) => void;
  buyerLocation?: { lat: number; lng: number } | null;
  radius?: number;
}

export function ProductsMap({ 
  products, 
  onProductClick, 
  buyerLocation, 
  radius 
}: ProductsMapProps) {
  // This is a placeholder component for the map view
  // In a real implementation, this would integrate with Google Maps or similar
  // For now, we'll show a simple list view with location information

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Map View ({products.length} products)
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {buyerLocation ? 'Your location detected' : 'Location not available'}
          </span>
        </div>
      </div>

      {/* Placeholder for actual map */}
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-6">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Map View</p>
          <p className="text-sm text-gray-500 mt-1">
            Google Maps integration will be implemented here
          </p>
        </div>
      </div>

      {/* Products list with location info */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Products by Location</h4>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found in this area</p>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0">
                  <img
                    src={product.images?.[0] || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 truncate">
                    {product.title}
                  </h5>
                  <p className="text-sm text-gray-600 capitalize">
                    {product.crop_type}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{product.farmer_location}</span>
                    </div>
                    {product.distance && (
                      <span className="text-sm text-gray-500">
                        {product.distance.toFixed(1)} km away
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ₦{product.price_per_unit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    per {product.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map controls placeholder */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <MapPin className="h-4 w-4" />
              Use My Location
            </button>
            {radius && (
              <span className="text-sm text-gray-600">
                Search radius: {radius}km
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Navigation className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">
              {products.length} products shown
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
