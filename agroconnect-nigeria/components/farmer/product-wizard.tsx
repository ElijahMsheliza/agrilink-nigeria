'use client';

import { useState } from 'react';
import { BasicInfoForm } from './basic-info-form';
import { QuantityPricingForm } from './quantity-pricing-form';
import { ProductDetailsForm } from './product-details-form';
import { ImageUpload } from './image-upload';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { 
  BasicInfoFormData, 
  QuantityPricingFormData, 
  ProductDetailsFormData 
} from '@/lib/validations/product';
import type { ImageFile } from '@/lib/image-utils';

interface ProductWizardProps {
  onComplete: (productData: any) => void;
  onSaveDraft: (draftData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

type WizardStep = 'basic' | 'pricing' | 'details' | 'images' | 'review';

const STEPS = [
  { id: 'basic', title: 'Basic Info', description: 'Crop & variety' },
  { id: 'pricing', title: 'Pricing', description: 'Quantity & price' },
  { id: 'details', title: 'Details', description: 'Dates & storage' },
  { id: 'images', title: 'Images', description: 'Product photos' },
  { id: 'review', title: 'Review', description: 'Final check' }
] as const;

export function ProductWizard({ 
  onComplete, 
  onSaveDraft, 
  onCancel, 
  initialData 
}: ProductWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic');
  const [formData, setFormData] = useState({
    basic: initialData?.basic || {},
    pricing: initialData?.pricing || {},
    details: initialData?.details || {},
    images: initialData?.images || []
  });

  const currentStepIndex = STEPS.findIndex(step => step.id === currentStep);

  const updateFormData = (step: keyof typeof formData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [step]: data
    }));
  };

  const handleBasicInfoNext = (data: BasicInfoFormData) => {
    updateFormData('basic', data);
    setCurrentStep('pricing');
  };

  const handleBasicInfoSaveDraft = (data: Partial<BasicInfoFormData>) => {
    updateFormData('basic', data);
    onSaveDraft({ ...formData, basic: data });
  };

  const handlePricingNext = (data: QuantityPricingFormData) => {
    updateFormData('pricing', data);
    setCurrentStep('details');
  };

  const handlePricingBack = () => {
    setCurrentStep('basic');
  };

  const handlePricingSaveDraft = (data: Partial<QuantityPricingFormData>) => {
    updateFormData('pricing', data);
    onSaveDraft({ ...formData, pricing: data });
  };

  const handleDetailsNext = (data: ProductDetailsFormData) => {
    updateFormData('details', data);
    setCurrentStep('images');
  };

  const handleDetailsBack = () => {
    setCurrentStep('pricing');
  };

  const handleDetailsSaveDraft = (data: Partial<ProductDetailsFormData>) => {
    updateFormData('details', data);
    onSaveDraft({ ...formData, details: data });
  };

  const handleImagesNext = () => {
    setCurrentStep('review');
  };

  const handleImagesBack = () => {
    setCurrentStep('details');
  };

  const handleImagesSaveDraft = () => {
    onSaveDraft(formData);
  };

  const handleImagesChange = (images: ImageFile[]) => {
    updateFormData('images', images);
  };

  const handleComplete = () => {
    const completeData = {
      ...formData.basic,
      ...formData.pricing,
      ...formData.details,
      images: formData.images
    };
    onComplete(completeData);
  };

  const handleBack = () => {
    if (currentStep === 'pricing') {
      setCurrentStep('basic');
    } else if (currentStep === 'details') {
      setCurrentStep('pricing');
    } else if (currentStep === 'images') {
      setCurrentStep('details');
    } else if (currentStep === 'review') {
      setCurrentStep('images');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoForm
            initialData={formData.basic}
            onNext={handleBasicInfoNext}
            onSaveDraft={handleBasicInfoSaveDraft}
          />
        );
      case 'pricing':
        return (
          <QuantityPricingForm
            initialData={formData.pricing}
            cropType={formData.basic.crop_type}
            onNext={handlePricingNext}
            onBack={handlePricingBack}
            onSaveDraft={handlePricingSaveDraft}
          />
        );
      case 'details':
        return (
          <ProductDetailsForm
            initialData={formData.details}
            onNext={handleDetailsNext}
            onBack={handleDetailsBack}
            onSaveDraft={handleDetailsSaveDraft}
          />
        );
      case 'images':
        return (
          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            onNext={handleImagesNext}
            onBack={handleImagesBack}
            onSaveDraft={handleImagesSaveDraft}
          />
        );
      case 'review':
        return <ProductReview data={formData} onComplete={handleComplete} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${
                      isCurrent ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderStepContent()}
      </div>

      {/* Cancel Button */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel and return to dashboard
        </button>
      </div>
    </div>
  );
}

// Product Review Component
function ProductReview({ data, onComplete, onBack }: { 
  data: any; 
  onComplete: () => void; 
  onBack: () => void; 
}) {
  const { basic, pricing, details, images } = data;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Product</h2>
        <p className="text-gray-600 mt-2">Please review all information before publishing</p>
      </div>

      <div className="space-y-6">
        {/* Basic Info Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Crop Type</p>
              <p className="font-medium">{basic.crop_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Variety</p>
              <p className="font-medium">{basic.variety}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product Title</p>
              <p className="font-medium">{basic.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quality Grade</p>
              <p className="font-medium">{basic.quality_grade}</p>
            </div>
            {basic.is_organic && (
              <div className="sm:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Organic Produce
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Pricing & Quantity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Quantity Available</p>
              <p className="font-medium">{pricing.quantity_available} {pricing.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price Per Unit</p>
              <p className="font-medium">₦{pricing.price_per_unit?.toLocaleString()}</p>
            </div>
            {pricing.minimum_order_quantity && (
              <div>
                <p className="text-sm text-gray-500">Minimum Order</p>
                <p className="font-medium">{pricing.minimum_order_quantity} {pricing.unit}</p>
              </div>
            )}
            {pricing.bulk_discount_percentage > 0 && (
              <div>
                <p className="text-sm text-gray-500">Bulk Discount</p>
                <p className="font-medium">{pricing.bulk_discount_percentage}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Details Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.harvest_date && (
              <div>
                <p className="text-sm text-gray-500">Harvest Date</p>
                <p className="font-medium">{new Date(details.harvest_date).toLocaleDateString()}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Available From</p>
              <p className="font-medium">{new Date(details.available_from).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Until</p>
              <p className="font-medium">{new Date(details.available_until).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Storage Method</p>
              <p className="font-medium">{details.storage_method}</p>
            </div>
            {details.description && (
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{details.description}</p>
              </div>
            )}
            {details.certifications && details.certifications.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Certifications</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {details.certifications.map((cert: string) => (
                    <span
                      key={cert}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Review */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Product Images ({images.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((image: ImageFile, index: number) => (
              <div key={image.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image.preview}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Publish Product
        </button>
      </div>
    </div>
  );
}
