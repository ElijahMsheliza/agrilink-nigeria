'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductWizard } from '@/components/farmer/product-wizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProductCreated = (productId: string) => {
    toast.success('Product created successfully!');
    router.push(`/app/farmer/products/${productId}/preview`);
  };

  const handleSaveAsDraft = (draftId: string) => {
    toast.success('Product saved as draft');
    router.push('/app/farmer/products');
  };

  const handleCancel = () => {
    router.push('/app/farmer/products');
  };

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
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Add New Product
                </h1>
                <p className="text-sm text-gray-500">
                  Create a new product listing for your farm
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ProductWizard
            onProductCreated={handleProductCreated}
            onSaveAsDraft={handleSaveAsDraft}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
