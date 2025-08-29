import { render, screen } from '@testing-library/react';
import { BasicInfoForm } from '@/components/farmer/basic-info-form';
import { QuantityPricingForm } from '@/components/farmer/quantity-pricing-form';
import { ProductDetailsForm } from '@/components/farmer/product-details-form';
import { ImageUpload } from '@/components/farmer/image-upload';
import { ProductCard } from '@/components/farmer/product-card';
import { ProductsDashboard } from '@/components/farmer/products-dashboard';

// Mock the utility functions
jest.mock('@/lib/product-utils', () => ({
  generateProductTitle: jest.fn(() => 'Test Product Title'),
  formatPrice: jest.fn((price: number) => `₦${price.toLocaleString()}`),
  calculateTotalValue: jest.fn((quantity: number, price: number) => quantity * price),
  getProductStatus: jest.fn(() => 'active'),
  getStatusDisplayText: jest.fn((status: string) => status === 'active' ? 'Active' : 'Inactive'),
  getStatusColorClass: jest.fn((status: string) => status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'),
}));

jest.mock('@/lib/crop-utils', () => ({
  getApprovedCrops: jest.fn(() => ['Rice', 'Maize', 'Cassava']),
  getCropVarieties: jest.fn(() => ['Local', 'Improved']),
  getCropIcon: jest.fn(() => '🌾'),
  getStorageMethodText: jest.fn((method: string) => method),
  getCertificationText: jest.fn((certification: string) => certification),
}));

jest.mock('@/lib/image-utils', () => ({
  validateImageFile: jest.fn(() => ({ isValid: true })),
  processImages: jest.fn(() => Promise.resolve([])),
}));

describe('Farmer Product Management System', () => {
  describe('BasicInfoForm', () => {
    it('renders basic info form fields', () => {
      const mockOnNext = jest.fn();
      const mockOnSaveDraft = jest.fn();
      
      render(
        <BasicInfoForm
          data={{}}
          onNext={mockOnNext}
          onSaveDraft={mockOnSaveDraft}
          isSubmitting={false}
        />
      );

      expect(screen.getByText(/basic product information/i)).toBeInTheDocument();
      expect(screen.getByText(/tell us about your crop/i)).toBeInTheDocument();
      expect(screen.getByText(/rice/i)).toBeInTheDocument();
      expect(screen.getByText(/maize/i)).toBeInTheDocument();
    });
  });

  describe('QuantityPricingForm', () => {
    it('renders quantity and pricing form fields', () => {
      const mockOnNext = jest.fn();
      const mockOnPrevious = jest.fn();
      const mockOnSaveDraft = jest.fn();
      
      render(
        <QuantityPricingForm
          data={{}}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          onSaveDraft={mockOnSaveDraft}
          isSubmitting={false}
        />
      );

      expect(screen.getByText(/quantity & pricing/i)).toBeInTheDocument();
      expect(screen.getByText(/set your quantities and prices/i)).toBeInTheDocument();
    });
  });

  describe('ProductDetailsForm', () => {
    it('renders product details form fields', () => {
      const mockOnNext = jest.fn();
      const mockOnPrevious = jest.fn();
      const mockOnSaveDraft = jest.fn();
      
      render(
        <ProductDetailsForm
          data={{}}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          onSaveDraft={mockOnSaveDraft}
          isSubmitting={false}
        />
      );

      expect(screen.getByText(/product details/i)).toBeInTheDocument();
      expect(screen.getByText(/additional information about your product/i)).toBeInTheDocument();
    });
  });

  describe('ImageUpload', () => {
    it('renders image upload component', () => {
      const mockOnNext = jest.fn();
      const mockOnPrevious = jest.fn();
      const mockOnSaveDraft = jest.fn();
      
      render(
        <ImageUpload
          data={{}}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          onSaveDraft={mockOnSaveDraft}
          isSubmitting={false}
        />
      );

      expect(screen.getByText(/product images/i)).toBeInTheDocument();
      expect(screen.getByText(/upload photos of your product/i)).toBeInTheDocument();
    });
  });

  describe('ProductCard', () => {
    it('renders product card with basic information', () => {
      const mockProduct = {
        id: '1',
        title: 'Test Rice',
        cropType: 'Rice',
        pricePerUnit: 50000,
        quantityAvailable: 100,
        unit: 'kg',
        qualityGrade: 'Premium',
        isOrganic: true,
        status: 'active',
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockOnEdit = jest.fn();
      const mockOnDelete = jest.fn();
      const mockOnToggleStatus = jest.fn();
      
      render(
        <ProductCard
          product={mockProduct}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onToggleStatus={mockOnToggleStatus}
          isSelected={false}
          onSelect={() => {}}
        />
      );

      expect(screen.getByText('Test Rice')).toBeInTheDocument();
      expect(screen.getByText('Rice')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });
  });

  describe('ProductsDashboard', () => {
    it('renders products dashboard with controls', () => {
      const mockProducts = [];
      const mockOnAddProduct = jest.fn();
      const mockOnEditProduct = jest.fn();
      const mockOnDeleteProduct = jest.fn();
      const mockOnToggleStatus = jest.fn();
      
      render(
        <ProductsDashboard
          products={mockProducts}
          onAddProduct={mockOnAddProduct}
          onEditProduct={mockOnEditProduct}
          onDeleteProduct={mockOnDeleteProduct}
          onToggleStatus={mockOnToggleStatus}
          isLoading={false}
        />
      );

      expect(screen.getByText(/my products/i)).toBeInTheDocument();
      expect(screen.getByText(/add product/i)).toBeInTheDocument();
    });
  });
});
