'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quantityPricingSchema, type QuantityPricingFormData } from '@/lib/validations/product';
import { formatPrice, formatTotalValue, validatePriceRange } from '@/lib/product-utils';
import { MEASUREMENT_UNITS } from '@/constants/nigeria';

interface QuantityPricingFormProps {
  initialData?: Partial<QuantityPricingFormData>;
  cropType?: string;
  onNext: (data: QuantityPricingFormData) => void;
  onBack: () => void;
  onSaveDraft: (data: Partial<QuantityPricingFormData>) => void;
}

export function QuantityPricingForm({ 
  initialData, 
  cropType, 
  onNext, 
  onBack, 
  onSaveDraft 
}: QuantityPricingFormProps) {
  const [priceWarning, setPriceWarning] = useState<string | null>(null);
  const [bulkDiscount, setBulkDiscount] = useState(initialData?.bulk_discount_percentage || 0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<QuantityPricingFormData>({
    resolver: zodResolver(quantityPricingSchema),
    defaultValues: {
      quantity_available: initialData?.quantity_available || 0,
      unit: initialData?.unit || '',
      price_per_unit: initialData?.price_per_unit || 0,
      minimum_order_quantity: initialData?.minimum_order_quantity || 0,
      bulk_discount_percentage: initialData?.bulk_discount_percentage || 0
    }
  });

  const watchedQuantity = watch('quantity_available');
  const watchedPrice = watch('price_per_unit');
  const watchedUnit = watch('unit');

  // Calculate total value
  const totalValue = watchedQuantity * watchedPrice;

  // Check price range when price or crop type changes
  useEffect(() => {
    if (watchedPrice > 0 && cropType) {
      const priceValidation = validatePriceRange(watchedPrice, cropType);
      setPriceWarning(priceValidation.message || null);
    } else {
      setPriceWarning(null);
    }
  }, [watchedPrice, cropType]);

  // Update bulk discount in form
  useEffect(() => {
    setValue('bulk_discount_percentage', bulkDiscount);
  }, [bulkDiscount, setValue]);

  const onSubmit = (data: QuantityPricingFormData) => {
    onNext(data);
  };

  const handleSaveDraft = () => {
    const currentData = watch();
    onSaveDraft(currentData);
  };

  const calculateBulkPrice = (quantity: number, basePrice: number, discount: number) => {
    const totalPrice = quantity * basePrice;
    const discountAmount = totalPrice * (discount / 100);
    return totalPrice - discountAmount;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Quantity & Pricing</h2>
        <p className="text-gray-600 mt-2">Set your quantities and prices</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quantity Available */}
        <div>
          <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Available *
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              id="quantity_available"
              step="0.1"
              min="0.1"
              {...register('quantity_available', { valueAsNumber: true })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.0"
            />
            <select
              {...register('unit')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Unit</option>
              {MEASUREMENT_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          {errors.quantity_available && (
            <p className="text-red-600 text-sm mt-1">{errors.quantity_available.message}</p>
          )}
          {errors.unit && (
            <p className="text-red-600 text-sm mt-1">{errors.unit.message}</p>
          )}
        </div>

        {/* Price Per Unit */}
        <div>
          <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700 mb-2">
            Price Per Unit (₦) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">₦</span>
            <input
              type="number"
              id="price_per_unit"
              step="100"
              min="100"
              {...register('price_per_unit', { valueAsNumber: true })}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
          {errors.price_per_unit && (
            <p className="text-red-600 text-sm mt-1">{errors.price_per_unit.message}</p>
          )}
          {priceWarning && (
            <p className="text-orange-600 text-sm mt-1">⚠️ {priceWarning}</p>
          )}
        </div>

        {/* Total Value Display */}
        {watchedQuantity > 0 && watchedPrice > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Value:</span>
              <span className="text-lg font-bold text-green-600">
                {formatTotalValue(watchedQuantity, watchedPrice)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {watchedQuantity} {watchedUnit} × {formatPrice(watchedPrice)} per {watchedUnit}
            </p>
          </div>
        )}

        {/* Minimum Order Quantity */}
        <div>
          <label htmlFor="minimum_order_quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Order Quantity (Optional)
          </label>
          <input
            type="number"
            id="minimum_order_quantity"
            step="0.1"
            min="0.1"
            {...register('minimum_order_quantity', { valueAsNumber: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Leave empty for no minimum"
          />
          {errors.minimum_order_quantity && (
            <p className="text-red-600 text-sm mt-1">{errors.minimum_order_quantity.message}</p>
          )}
        </div>

        {/* Bulk Pricing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulk Discount (Optional)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={bulkDiscount}
                onChange={(e) => setBulkDiscount(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
                {bulkDiscount}%
              </span>
            </div>
            
            {bulkDiscount > 0 && watchedQuantity > 0 && watchedPrice > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Bulk Pricing Example:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Regular price for 1 {watchedUnit}:</span>
                    <span>{formatPrice(watchedPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bulk price for 1 {watchedUnit}:</span>
                    <span>{formatPrice(watchedPrice * (1 - bulkDiscount / 100))}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Savings per {watchedUnit}:</span>
                    <span className="text-green-600">
                      {formatPrice(watchedPrice * (bulkDiscount / 100))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Price Comparison */}
        {cropType && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Market Information:</h4>
            <p className="text-sm text-gray-600">
              Current market prices for {cropType} typically range from ₦{formatPrice(1000)} to ₦{formatPrice(50000)} per {watchedUnit || 'unit'}.
              Consider local market conditions when setting your price.
            </p>
          </div>
        )}

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
            Next: Product Details
          </button>
        </div>
      </form>
    </div>
  );
}
