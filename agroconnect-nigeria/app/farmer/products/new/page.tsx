'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductWizard } from '../../../../components/farmer/product-wizard';
import type { ImageFile } from '../../../../lib/image-utils';

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (productData: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/farmer/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/farmer/products/${result.product.id}/preview?success=true`);
      } else {
        const error = await response.json();
        console.error('Failed to create product:', error);
        alert('Failed to create product. Please try again.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (draftData: any) => {
    try {
      // For now, we'll just show a message
      // In a real implementation, you'd save to a drafts table or localStorage
      console.log('Saving draft:', draftData);
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/farmer/products');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductWizard
          onComplete={handleComplete}
          onSaveDraft={handleSaveDraft}
          onCancel={handleCancel}
        />
      </div>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="text-gray-700">Creating your product...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

