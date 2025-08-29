'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SearchFilters, debounce } from '../../lib/search-utils';
import { getCurrentLocation, NIGERIAN_STATES, getLGAsForState } from '../../lib/location-utils';

interface SearchHeaderProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchHeader({ filters, onFiltersChange, onSearch, isLoading = false }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState<number | null>(filters.stateId || null);
  const [selectedLGA, setSelectedLGA] = useState<number | null>(filters.lgaId || null);
  const [availableLGAs, setAvailableLGAs] = useState<any[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      onFiltersChange({
        ...filters,
        buyerLat: location.lat,
        buyerLng: location.lng,
        radius: filters.radius || 50
      });
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to Nigeria center
      onFiltersChange({
        ...filters,
        buyerLat: 9.0820,
        buyerLng: 8.6753,
        radius: filters.radius || 50
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle state selection
  const handleStateChange = (stateId: number) => {
    setSelectedState(stateId);
    setSelectedLGA(null);
    const lgas = getLGAsForState(stateId);
    setAvailableLGAs(lgas);
    
    onFiltersChange({
      ...filters,
      stateId,
      lgaId: null
    });
  };

  // Handle LGA selection
  const handleLGAChange = (lgaId: number) => {
    setSelectedLGA(lgaId);
    onFiltersChange({
      ...filters,
      lgaId
    });
  };

  // Handle radius change
  const handleRadiusChange = (radius: number) => {
    onFiltersChange({
      ...filters,
      radius
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState(null);
    setSelectedLGA(null);
    setAvailableLGAs([]);
    onFiltersChange({
      page: 1,
      limit: 20,
      sortBy: 'date'
    });
  };

  // Quick filter chips
  const quickFilters = [
    { label: 'Organic', key: 'isOrganic', value: true },
    { label: 'Premium Grade', key: 'qualityGrades', value: ['premium'] },
    { label: 'Available Now', key: 'availability', value: 'now' },
    { label: 'Within 50km', key: 'radius', value: 50 }
  ];

  const handleQuickFilter = (filter: typeof quickFilters[0]) => {
    const currentValue = filters[filter.key as keyof SearchFilters];
    
    if (filter.key === 'qualityGrades') {
      const currentGrades = currentValue as string[] || [];
      const newGrades = currentGrades.includes('premium') 
        ? currentGrades.filter(g => g !== 'premium')
        : [...currentGrades, 'premium'];
      
      onFiltersChange({
        ...filters,
        [filter.key]: newGrades.length > 0 ? newGrades : undefined
      });
    } else {
      onFiltersChange({
        ...filters,
        [filter.key]: currentValue === filter.value ? undefined : filter.value
      });
    }
  };

  // Check if filter is active
  const isFilterActive = (filter: typeof quickFilters[0]) => {
    const currentValue = filters[filter.key as keyof SearchFilters];
    
    if (filter.key === 'qualityGrades') {
      const currentGrades = currentValue as string[] || [];
      return currentGrades.includes('premium');
    }
    
    return currentValue === filter.value;
  };

  // Get selected state name
  const getSelectedStateName = () => {
    if (!selectedState) return 'Select State';
    const state = NIGERIAN_STATES.find(s => s.id === selectedState);
    return state?.name || 'Select State';
  };

  // Get selected LGA name
  const getSelectedLGAName = () => {
    if (!selectedLGA) return 'Select LGA';
    const lga = availableLGAs.find(l => l.id === selectedLGA);
    return lga?.name || 'Select LGA';
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for rice, maize, cassava, farmers..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 h-12 text-base"
              disabled={isLoading}
            />
          </div>

          {/* Location Selector */}
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="h-12 px-4 min-w-[140px]"
                disabled={isLoading}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {getSelectedStateName()}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Select Location</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={isGettingLocation}
                      className="w-full justify-start text-sm"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      {isGettingLocation ? 'Getting location...' : 'Use my location'}
                    </Button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {NIGERIAN_STATES.map((state) => (
                      <button
                        key={state.id}
                        onClick={() => handleStateChange(state.id)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                          selectedState === state.id ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {state.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Radius Selector */}
            <select
              value={filters.radius || 50}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="h-12 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            >
              <option value={10}>10km</option>
              <option value={25}>25km</option>
              <option value={50}>50km</option>
              <option value={100}>100km</option>
              <option value={250}>250km</option>
              <option value={500}>500km</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => handleQuickFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isFilterActive(filter)
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
          
          {/* Clear All Button */}
          {(filters.query || filters.stateId || filters.isOrganic || filters.radius !== 50) && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        {/* LGA Dropdown (if state is selected) */}
        {selectedState && availableLGAs.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Local Government Area
            </label>
            <select
              value={selectedLGA || ''}
              onChange={(e) => handleLGAChange(Number(e.target.value))}
              className="w-full sm:w-64 h-10 px-3 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              disabled={isLoading}
            >
              <option value="">All LGAs</option>
              {availableLGAs.map((lga) => (
                <option key={lga.id} value={lga.id}>
                  {lga.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Active Filters Summary */}
        {(filters.query || filters.stateId || filters.isOrganic || filters.radius !== 50) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {filters.query && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                "{filters.query}"
              </span>
            )}
            {filters.stateId && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {getSelectedStateName()}
              </span>
            )}
            {filters.isOrganic && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Organic
              </span>
            )}
            {filters.radius !== 50 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Within {filters.radius}km
              </span>
            )}
          </div>
        )}
      </div>

      {/* Backdrop for dropdown */}
      {showLocationDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowLocationDropdown(false)}
        />
      )}
    </div>
  );
}
