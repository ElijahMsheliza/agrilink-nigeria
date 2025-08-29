'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductsDashboard } from '../../../components/farmer/products-dashboard';
import type { Product } from '../../../types/database';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/farmer/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    router.push('/farmer/products/new');
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/farmer/products/${productId}/edit`);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/farmer/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove product from local state
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handlePreviewProduct = (productId: string) => {
    router.push(`/farmer/products/${productId}/preview`);
  };

  const handleToggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await fetch(`/api/farmer/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          is_active: isActive
        })
      });

      if (response.ok) {
        // Update product in local state
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, is_active: isActive } : p
        ));
      } else {
        console.error('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete', productIds: string[]) => {
    try {
      if (action === 'delete') {
        // Delete products one by one
        for (const productId of productIds) {
          await handleDeleteProduct(productId);
        }
      } else {
        // Update products one by one
        for (const productId of productIds) {
          await handleToggleProductStatus(productId, action === 'activate');
        }
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsDashboard
          products={products}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onPreviewProduct={handlePreviewProduct}
          onToggleProductStatus={handleToggleProductStatus}
          onBulkAction={handleBulkAction}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
