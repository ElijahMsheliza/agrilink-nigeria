'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Package, 
  DollarSign,
  Star,
  Leaf,
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { formatPrice, calculateTotalValue, getProductStatus } from '@/lib/product-utils';
import { getCropIcon } from '@/lib/crop-utils';

export default function ProductPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/farmer/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        toast.error('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleEdit = () => {
    router.push(`/app/farmer/products/${productId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/farmer/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      router.push('/app/farmer/products');
    } catch (err) {
      toast.error('Failed to delete product');
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    router.push('/app/farmer/products');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={handleBack}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const status = getProductStatus(product);
  const totalValue = calculateTotalValue(product.quantityAvailable, product.pricePerUnit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Product Preview
                </h1>
                <p className="text-sm text-gray-500">
                  Review your product listing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{getCropIcon(product.cropType)}</span>
                  <span>Product Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.images && product.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`${product.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No images uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleEdit} 
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
                <Button 
                  onClick={handleDelete} 
                  className="w-full"
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Product
                </Button>
              </CardContent>
            </Card>

            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  variant={status === 'active' ? 'default' : 'secondary'}
                  className="w-full justify-center"
                >
                  {status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-8 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Title</h3>
                <p className="text-gray-600">{product.title}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Crop Type</h3>
                <p className="text-gray-600">{product.cropType}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Variety</h3>
                <p className="text-gray-600">{product.variety || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quality Grade</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-gray-600">{product.qualityGrade}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Organic</h3>
                <div className="flex items-center space-x-2">
                  {product.isOrganic ? (
                    <>
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Yes</span>
                    </>
                  ) : (
                    <span className="text-gray-600">No</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Quantity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Pricing & Quantity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Price per Unit</h3>
                <p className="text-2xl font-semibold text-green-600">
                  {formatPrice(product.pricePerUnit)}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Quantity Available</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {product.quantityAvailable} {product.unit}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Total Value</h3>
                <p className="text-2xl font-semibold text-green-600">
                  {formatPrice(totalValue)}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Minimum Order</h3>
                <p className="text-gray-600">{product.minimumOrderQuantity} {product.unit}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Unit</h3>
                <p className="text-gray-600">{product.unit}</p>
              </div>
            </CardContent>
          </Card>

          {/* Availability & Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Availability & Dates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Harvest Date</h3>
                <p className="text-gray-600">
                  {new Date(product.harvestDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Available From</h3>
                <p className="text-gray-600">
                  {new Date(product.availableFrom).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Available Until</h3>
                <p className="text-gray-600">
                  {new Date(product.availableUntil).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Storage Method</h3>
                <p className="text-gray-600">{product.storageMethod}</p>
              </div>
            </CardContent>
          </Card>

          {/* Location & Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location & Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                <p className="text-gray-600">{product.location}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
              </div>
              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
