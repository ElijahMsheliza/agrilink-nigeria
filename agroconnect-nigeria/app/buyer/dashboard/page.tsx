'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, Package, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../../lib/auth-store';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFavorites: 0,
    recentSearches: 0,
    activeInquiries: 0,
    nearbyProducts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch favorites count
      const favoritesResponse = await fetch('/api/buyer/favorites?limit=1');
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        setStats(prev => ({ ...prev, totalFavorites: favoritesData.pagination.total }));
      }

      // TODO: Implement other stats fetching
      // For now, using mock data
      setStats(prev => ({
        ...prev,
        recentSearches: 5,
        activeInquiries: 2,
        nearbyProducts: 12
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.profile?.full_name || 'Buyer'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Discover quality agricultural products from Nigerian farmers
          </p>
        </div>

        {/* Quick Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for rice, maize, cassava, farmers..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <Link
              href="/buyer/browse"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorite Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Searches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentSearches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeInquiries}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nearby Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.nearbyProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Browse Products Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Browse Products</h2>
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              Discover quality agricultural products from verified Nigerian farmers
            </p>
            <Link
              href="/buyer/browse"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Start Browsing
            </Link>
          </div>

          {/* Favorites Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Favorites</h2>
              <Heart className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              View and manage your saved products for quick access
            </p>
            <Link
              href="/buyer/favorites"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Heart className="h-4 w-4 mr-2" />
              View Favorites
            </Link>
          </div>
        </div>

        {/* Trending Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Trending Products</h2>
              <Link
                href="/buyer/browse"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trending products yet</h3>
              <p className="text-gray-600 mb-4">
                Start browsing to see popular products in your area
              </p>
              <Link
                href="/buyer/browse"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600">
                Your recent searches and interactions will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
