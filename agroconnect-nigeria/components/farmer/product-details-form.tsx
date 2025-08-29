'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productDetailsSchema, type ProductDetailsFormData } from '@/lib/validations/product';
import { getStorageMethodText, getCertificationText } from '@/lib/crop-utils';
import { STORAGE_METHODS, CERTIFICATIONS } from '@/constants/nigeria';

interface ProductDetailsFormProps {
  initialData?: Partial<ProductDetailsFormData>;
  onNext: (data: ProductDetailsFormData) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<ProductDetailsFormData>) => void;
}

export function ProductDetailsForm({ 
  initialData, 
  onNext, 
  onBack, 
  onSaveDraft 
}: ProductDetailsFormProps) {
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>(
    initialData?.certifications || []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProductDetailsFormData>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      harvest_date: initialData?.harvest_date || '',
      available_from: initialData?.available_from || '',
      available_until: initialData?.available_until || '',
      storage_method: initialData?.storage_method || '',
      description: initialData?.description || '',
      certifications: initialData?.certifications || []
    }
  });

  const watchedDescription = watch('description');
  const watchedAvailableFrom = watch('available_from');
  const watchedAvailableUntil = watch('available_until');

  const onSubmit = (data: ProductDetailsFormData) => {
    data.certifications = selectedCertifications;
    onNext(data);
  };

  const handleSaveDraft = () => {
    const currentData = watch();
    currentData.certifications = selectedCertifications;
    onSaveDraft(currentData);
  };

  const handleCertificationToggle = (certification: string) => {
    setSelectedCertifications(prev => 
      prev.includes(certification)
        ? prev.filter(c => c !== certification)
        : [...prev, certification]
    );
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
        <p className="text-gray-600 mt-2">Additional information about your product</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Harvest Date */}
        <div>
          <label htmlFor="harvest_date" className="block text-sm font-medium text-gray-700 mb-2">
            Harvest Date (Optional)
          </label>
          <input
            type="date"
            id="harvest_date"
            {...register('harvest_date')}
            max={getMaxDate()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.harvest_date && (
            <p className="text-red-600 text-sm mt-1">{errors.harvest_date.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Leave empty if harvested recently or for pre-orders
          </p>
        </div>

        {/* Available From Date */}
        <div>
          <label htmlFor="available_from" className="block text-sm font-medium text-gray-700 mb-2">
            Available From Date *
          </label>
          <input
            type="date"
            id="available_from"
            {...register('available_from')}
            min={getMinDate()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.available_from && (
            <p className="text-red-600 text-sm mt-1">{errors.available_from.message}</p>
          )}
        </div>

        {/* Available Until Date */}
        <div>
          <label htmlFor="available_until" className="block text-sm font-medium text-gray-700 mb-2">
            Available Until Date *
          </label>
          <input
            type="date"
            id="available_until"
            {...register('available_until')}
            min={watchedAvailableFrom || getMinDate()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {errors.available_until && (
            <p className="text-red-600 text-sm mt-1">{errors.available_until.message}</p>
          )}
        </div>

        {/* Storage Method */}
        <div>
          <label htmlFor="storage_method" className="block text-sm font-medium text-gray-700 mb-2">
            Storage Method *
          </label>
          <select
            id="storage_method"
            {...register('storage_method')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select storage method</option>
            {STORAGE_METHODS.map((method) => (
              <option key={method} value={method}>
                {getStorageMethodText(method)}
              </option>
            ))}
          </select>
          {errors.storage_method && (
            <p className="text-red-600 text-sm mt-1">{errors.storage_method.message}</p>
          )}
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Product Description (Optional)
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Describe your product quality, special features, or any additional information buyers should know..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {(watchedDescription?.length || 0)}/1000 characters
          </p>
        </div>

        {/* Certifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Certifications (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CERTIFICATIONS.map((certification) => (
              <label
                key={certification}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCertifications.includes(certification)}
                  onChange={() => handleCertificationToggle(certification)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <span className="text-sm text-gray-700">
                  {getCertificationText(certification)}
                </span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Select all applicable certifications for your product
          </p>
        </div>

        {/* Date Range Validation */}
        {watchedAvailableFrom && watchedAvailableUntil && (
          <div className={`p-4 rounded-lg ${
            new Date(watchedAvailableFrom) >= new Date(watchedAvailableUntil)
              ? 'bg-red-50 border border-red-200'
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-sm ${
              new Date(watchedAvailableFrom) >= new Date(watchedAvailableUntil)
                ? 'text-red-600'
                : 'text-green-600'
            }`}>
              {new Date(watchedAvailableFrom) >= new Date(watchedAvailableUntil)
                ? '⚠️ Available until date must be after available from date'
                : '✅ Date range is valid'
              }
            </p>
          </div>
        )}

        {/* Storage Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Storage Tips:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Choose the storage method that best preserves your product quality</li>
            <li>• Consider local climate and storage facilities available</li>
            <li>• Ensure proper ventilation and pest control</li>
            <li>• Regular monitoring helps maintain product quality</li>
          </ul>
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
            onClick={handleSaveDraft}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Next: Images
          </button>
        </div>
      </form>
    </div>
  );
}
