import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CaregiverProfile } from '../types';
import { CaregiverCard } from '../components/CaregiverCard';
import api from '../services/api';
import { Search, Filter, ShieldCheck, Star, DollarSign, Award, RefreshCw } from 'lucide-react';

export const CaregiverDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [serviceFilter, setServiceFilter] = useState(searchParams.get('service') || '');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('isVerified') !== 'false');
  const [sortBy, setSortBy] = useState('rating');

  const fetchCaregivers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (serviceFilter) params.append('service', serviceFilter);
      if (cityFilter) params.append('city', cityFilter);
      if (minRating) params.append('minRating', minRating);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (verifiedOnly) params.append('isVerified', 'true');

      const res = await api.get(`/caregivers?${params.toString()}`);
      if (res.data.success) {
        let list: CaregiverProfile[] = res.data.data;
        if (sortBy === 'price-low') list.sort((a, b) => a.hourlyRate - b.hourlyRate);
        else if (sortBy === 'price-high') list.sort((a, b) => b.hourlyRate - a.hourlyRate);
        else if (sortBy === 'experience') list.sort((a, b) => b.yearsExperience - a.yearsExperience);
        else list.sort((a, b) => b.ratingAvg - a.ratingAvg);
        setCaregivers(list);
      }
    } catch (error) {
      console.error('Failed to fetch caregivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, [serviceFilter, cityFilter, minRating, maxPrice, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCaregivers();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setServiceFilter('');
    setCityFilter('');
    setMinRating('');
    setMaxPrice('');
    setVerifiedOnly(false);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Verified Caregiver Directory
        </h1>
        <p className="text-sm text-slate-600">
          Browse licensed registered nurses, geriatric physiotherapists, and trained elder attendants
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by caregiver name, qualification, or clinical specialty..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Service Dropdown */}
          <div>
            <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">
              Service
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="">All Services</option>
              <option value="Nursing Care">Nursing Care</option>
              <option value="Elderly Attendant">Elderly Attendant</option>
              <option value="Physiotherapy">Physiotherapy</option>
              <option value="Post-Hospital Care">Post-Hospital Care</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">
              City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="">All Cities</option>
              <option value="New York">New York</option>
              <option value="Manhattan">Manhattan</option>
              <option value="Brooklyn">Brooklyn</option>
              <option value="Queens">Queens</option>
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">
              Max Hourly Rate
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="">Any Price</option>
              <option value="30">Under $30/hr</option>
              <option value="45">Under $45/hr</option>
              <option value="60">Under $60/hr</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 font-semibold"
            >
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>

          {/* Verified Toggle / Reset */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-1.5 cursor-pointer py-2">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="font-bold text-slate-800 text-[11px]">Verified Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Caregiver Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
          <p className="text-sm font-semibold">Loading available caregivers...</p>
        </div>
      ) : caregivers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-soft max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Caregivers Match Filters</h3>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            Try adjusting your search criteria or reset filters to see all available caregivers.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caregivers.map((caregiver) => (
            <CaregiverCard key={caregiver.id} caregiver={caregiver} />
          ))}
        </div>
      )}
    </div>
  );
};
