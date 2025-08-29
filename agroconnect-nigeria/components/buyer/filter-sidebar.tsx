'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter, Check } from 'lucide-react';
import { SearchFilters } from '../../lib/search-utils';
import { NIGERIAN_STATES, MAJOR_CROPS, QUALITY_GRADES } from '../../constants/nigeria';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  totalResults: number;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle, 
  totalResults 
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([
    'cropType', 'price', 'location', 'quality'
  ]));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange({ ...newFilters, page: 1 });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 20,
      sortBy: 'date'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.cropTypes?.length) count++;
    if (filters.qualityGrades?.length) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.stateId || filters.lgaId) count++;
    if (filters.radius) count++;
    if (filters.availability) count++;
    if (filters.certifications?.length) count++;
    if (filters.harvestDate) count++;
    if (filters.isOrganic) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {totalResults} results
          </span>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} lg:block
        bg-white border border-gray-200 rounded-lg shadow-sm p-6
        ${isOpen ? 'absolute top-full left-0 right-0 z-50 mt-2' : ''}
        lg:relative lg:mt-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onToggle}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Crop Type Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('cropType')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Crop Type</span>
            {expandedSections.has('cropType') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('cropType') && (
            <div className="space-y-2">
              {MAJOR_CROPS.map((crop) => (
                <label key={crop.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.cropTypes?.includes(crop.value) || false}
                    onChange={(e) => {
                      const current = filters.cropTypes || [];
                      const newCrops = e.target.checked
                        ? [...current, crop.value]
                        : current.filter(c => c !== crop.value);
                      updateFilter('cropTypes', newCrops.length > 0 ? newCrops : undefined);
                    }}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{crop.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Quality Grade Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('quality')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Quality Grade</span>
            {expandedSections.has('quality') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('quality') && (
            <div className="space-y-2">
              {QUALITY_GRADES.map((grade) => (
                <label key={grade.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.qualityGrades?.includes(grade.value) || false}
                    onChange={(e) => {
                      const current = filters.qualityGrades || [];
                      const newGrades = e.target.checked
                        ? [...current, grade.value]
                        : current.filter(g => g !== grade.value);
                      updateFilter('qualityGrades', newGrades.length > 0 ? newGrades : undefined);
                    }}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{grade.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Price Range (₦)</span>
            {expandedSections.has('price') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('price') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={() => {
                    clearFilter('minPrice');
                    clearFilter('maxPrice');
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear price filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('location')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Location</span>
            {expandedSections.has('location') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('location') && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={filters.stateId || ''}
                  onChange={(e) => {
                    const stateId = e.target.value ? parseInt(e.target.value) : undefined;
                    updateFilter('stateId', stateId);
                    // Clear LGA when state changes
                    if (stateId !== filters.stateId) {
                      clearFilter('lgaId');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All States</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance Radius
                </label>
                <select
                  value={filters.radius || ''}
                  onChange={(e) => updateFilter('radius', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Any distance</option>
                  <option value="10">Within 10km</option>
                  <option value="25">Within 25km</option>
                  <option value="50">Within 50km</option>
                  <option value="100">Within 100km</option>
                  <option value="200">Within 200km</option>
                </select>
              </div>

              {(filters.stateId || filters.radius) && (
                <button
                  onClick={() => {
                    clearFilter('stateId');
                    clearFilter('lgaId');
                    clearFilter('radius');
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear location filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Availability</span>
            {expandedSections.has('availability') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('availability') && (
            <div className="space-y-2">
              {[
                { value: 'now', label: 'Available Now' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={filters.availability === option.value}
                    onChange={(e) => updateFilter('availability', e.target.value as any)}
                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              {filters.availability && (
                <button
                  onClick={() => clearFilter('availability')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear availability filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Certifications Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('certifications')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Certifications</span>
            {expandedSections.has('certifications') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('certifications') && (
            <div className="space-y-2">
              {[
                { value: 'organic', label: 'Organic Certified' },
                { value: 'nafdac', label: 'NAFDAC Approved' },
                { value: 'son', label: 'SON Certified' },
                { value: 'iso', label: 'ISO Certified' }
              ].map((cert) => (
                <label key={cert.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.certifications?.includes(cert.value) || false}
                    onChange={(e) => {
                      const current = filters.certifications || [];
                      const newCerts = e.target.checked
                        ? [...current, cert.value]
                        : current.filter(c => c !== cert.value);
                      updateFilter('certifications', newCerts.length > 0 ? newCerts : undefined);
                    }}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{cert.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Harvest Date Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('harvest')}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <span className="font-medium text-gray-900">Harvest Date</span>
            {expandedSections.has('harvest') ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.has('harvest') && (
            <div className="space-y-2">
              {[
                { value: '30days', label: 'Last 30 Days' },
                { value: '3months', label: 'Last 3 Months' },
                { value: '6months', label: 'Last 6 Months' },
                { value: '1year', label: 'Last Year' }
              ].map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    name="harvestDate"
                    value={option.value}
                    checked={filters.harvestDate === option.value}
                    onChange={(e) => updateFilter('harvestDate', e.target.value as any)}
                    className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
              {filters.harvestDate && (
                <button
                  onClick={() => clearFilter('harvestDate')}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear harvest date filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Organic Filter */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.isOrganic || false}
              onChange={(e) => updateFilter('isOrganic', e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">Organic Products Only</span>
          </label>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="lg:hidden mt-6">
          <button
            onClick={onToggle}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Apply Filters ({totalResults} results)
          </button>
        </div>
      </div>
    </>
  );
}
