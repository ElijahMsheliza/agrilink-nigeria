'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { basicInfoSchema, type BasicInfoFormData } from '@/lib/validations/product';
import { getCropVarieties, getCropIcon, generateCropDescription } from '@/lib/crop-utils';
import { generateProductTitle } from '@/lib/product-utils';
import { MAJOR_CROPS, QUALITY_GRADES } from '@/constants/nigeria';

interface BasicInfoFormProps {
  initialData?: Partial<BasicInfoFormData>;
  onNext: (data: BasicInfoFormData) => void;
  onSaveDraft: (data: Partial<BasicInfoFormData>) => void;
}

export function BasicInfoForm({ initialData, onNext, onSaveDraft }: BasicInfoFormProps) {
  const [autoGenerateTitle, setAutoGenerateTitle] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(initialData?.crop_type || '');
  const [varieties, setVarieties] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      crop_type: initialData?.crop_type || '',
      variety: initialData?.variety || '',
      title: initialData?.title || '',
      is_organic: initialData?.is_organic || false,
      quality_grade: initialData?.quality_grade || ''
    }
  });

  const watchedCropType = watch('crop_type');
  const watchedVariety = watch('variety');

  // Update varieties when crop type changes
  useEffect(() => {
    if (watchedCropType) {
      setSelectedCrop(watchedCropType);
      const cropVarieties = getCropVarieties(watchedCropType);
      setVarieties(cropVarieties);
      
      // Auto-generate title if enabled
      if (autoGenerateTitle) {
        const newTitle = generateProductTitle(watchedCropType, watchedVariety);
        setValue('title', newTitle);
      }
    }
  }, [watchedCropType, watchedVariety, autoGenerateTitle, setValue]);

  // Auto-generate title when variety changes
  useEffect(() => {
    if (autoGenerateTitle && watchedCropType && watchedVariety) {
      const newTitle = generateProductTitle(watchedCropType, watchedVariety);
      setValue('title', newTitle);
    }
  }, [watchedVariety, autoGenerateTitle, watchedCropType, setValue]);

  const onSubmit = (data: BasicInfoFormData) => {
    onNext(data);
  };

  const handleSaveDraft = () => {
    const currentData = watch();
    onSaveDraft(currentData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Basic Product Information</h2>
        <p className="text-gray-600 mt-2">Tell us about your crop</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Crop Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MAJOR_CROPS.map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setValue('crop_type', crop)}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  watchedCropType === crop
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-2">{getCropIcon(crop)}</div>
                <div className="text-sm font-medium">{crop}</div>
              </button>
            ))}
          </div>
          {errors.crop_type && (
            <p className="text-red-600 text-sm mt-1">{errors.crop_type.message}</p>
          )}
        </div>

        {/* Crop Variety */}
        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-gray-700 mb-2">
            Crop Variety *
          </label>
          <input
            type="text"
            id="variety"
            {...register('variety')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., FARO 44, Yellow Maize, etc."
          />
          {errors.variety && (
            <p className="text-red-600 text-sm mt-1">{errors.variety.message}</p>
          )}
          
          {/* Suggested Varieties */}
          {varieties.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Common varieties:</p>
              <div className="flex flex-wrap gap-2">
                {varieties.slice(0, 5).map((variety) => (
                  <button
                    key={variety}
                    type="button"
                    onClick={() => setValue('variety', variety)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {variety}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Product Title *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoTitle"
                checked={autoGenerateTitle}
                onChange={(e) => setAutoGenerateTitle(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="autoTitle" className="text-sm text-gray-600">
                Auto-generate
              </label>
            </div>
          </div>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Product title (10-100 characters)"
            disabled={autoGenerateTitle}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {watch('title')?.length || 0}/100 characters
          </p>
        </div>

        {/* Quality Grade */}
        <div>
          <label htmlFor="quality_grade" className="block text-sm font-medium text-gray-700 mb-2">
            Quality Grade *
          </label>
          <select
            id="quality_grade"
            {...register('quality_grade')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select quality grade</option>
            {QUALITY_GRADES.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          {errors.quality_grade && (
            <p className="text-red-600 text-sm mt-1">{errors.quality_grade.message}</p>
          )}
        </div>

        {/* Organic Certification */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="is_organic"
            {...register('is_organic')}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 h-4 w-4"
          />
          <label htmlFor="is_organic" className="text-sm font-medium text-gray-700">
            This is organic produce
          </label>
        </div>

        {/* Description Preview */}
        {watchedCropType && watchedVariety && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description Preview:</h4>
            <p className="text-sm text-gray-600">
              {generateCropDescription(watchedCropType, watchedVariety, watch('quality_grade') || 'Grade A')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
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
            Next: Quantity & Pricing
          </button>
        </div>
      </form>
    </div>
  );
}
