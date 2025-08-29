'use client';

import { useState } from 'react';
import { Edit, Trash2, Eye, MoreVertical, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatPrice, getProductStatus, getStatusDisplayText, getStatusColorClass } from '@/lib/product-utils';
import { getCropIcon } from '@/lib/crop-utils';
import type { Product } from '@/types/database';

interface ProductCardProps {
  product: Product;
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
  onPreview: (productId: string) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
  isSelected?: boolean;
  onSelect?: (productId: string, selected: boolean) => void;
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleStatus,
  isSelected = false,
  onSelect 
}: ProductCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const status = getProductStatus(product);
  const statusText = getStatusDisplayText(status);
  const statusColor = getStatusColorClass(status);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await onDelete(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleStatus = () => {
    onToggleStatus(product.id, !product.is_active);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-green-500' : ''
    }`}>
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="p-3 border-b border-gray-100">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(product.id, e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
          />
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{getCropIcon(product.crop_type)}</div>
              <p className="text-sm text-gray-500">No image</p>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {getStatusIcon()}
            <span className="ml-1">{statusText}</span>
          </span>
        </div>

        {/* Action Menu */}
        <div className="absolute top-2 right-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100 transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onPreview(product.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => {
                      onEdit(product.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    {product.is_active ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
            {product.title}
          </h3>
        </div>

        <div className="space-y-2">
          {/* Crop Type */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{getCropIcon(product.crop_type)}</span>
            <span>{product.crop_type}</span>
            {product.is_organic && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Organic
              </span>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {product.quantity_available} {product.unit}
            </span>
            <span className="font-semibold text-green-600">
              {formatPrice(product.price_per_unit)}
            </span>
          </div>

          {/* Quality Grade */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quality:</span>
            <span className="text-sm font-medium text-gray-900">
              {product.quality_grade}
            </span>
          </div>

          {/* Dates */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Available: {new Date(product.available_from).toLocaleDateString()}</div>
            {product.available_until && (
              <div>Until: {new Date(product.available_until).toLocaleDateString()}</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-2">
          <button
            onClick={() => onPreview(product.id)}
            className="flex-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onEdit(product.id)}
            className="flex-1 px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile-optimized version
export function ProductCardMobile({ 
  product, 
  onEdit, 
  onDelete, 
  onPreview, 
  onToggleStatus 
}: ProductCardProps) {
  const [showActions, setShowActions] = useState(false);

  const status = getProductStatus(product);
  const statusText = getStatusDisplayText(status);
  const statusColor = getStatusColorClass(status);

  const handleDelete = async () => {
    if (confirm('Delete this product?')) {
      await onDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex space-x-3">
        {/* Product Image */}
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">{getCropIcon(product.crop_type)}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
              {product.title}
            </h3>
            <button
              onClick={() => setShowActions(!showActions)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600">
              <span className="mr-1">{getCropIcon(product.crop_type)}</span>
              <span>{product.crop_type}</span>
              {product.is_organic && (
                <span className="ml-1 px-1 py-0.5 rounded text-xs bg-green-100 text-green-800">
                  Organic
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">
                {product.quantity_available} {product.unit}
              </span>
              <span className="font-semibold text-green-600 text-sm">
                {formatPrice(product.price_per_unit)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {new Date(product.available_from).toLocaleDateString()}
              </span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {statusText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Menu */}
      {showActions && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onPreview(product.id);
                setShowActions(false);
              }}
              className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={() => {
                onEdit(product.id);
                setShowActions(false);
              }}
              className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
