'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { groupService, vehicleService } from '@/services';
import { Group, Vehicle, VehicleBrand, VehicleCategory } from '@/types';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  CarFront,
  Bike,
  Zap,
  MapPin,
  Check,
} from 'lucide-react';

function VehiclesContent() {
  const searchParams = useSearchParams();
  const { selectedLocation, setSelectedLocation } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [brands, setBrands] = useState<VehicleBrand[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [activeTab, setActiveTab] = useState<'all' | 'car' | 'bike' | 'scooter' | 'auto' | 'electric'>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'members' | 'price_asc' | 'price_desc'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const urlLoc = searchParams.get('location');
    if (urlLoc) {
      setSelectedLocation(urlLoc);
    }
  }, [searchParams, setSelectedLocation]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [vList, gList, bList, cList] = await Promise.all([
          vehicleService.getVehicles(),
          groupService.getGroups(),
          vehicleService.getBrands(),
          vehicleService.getCategories(),
        ]);
        setVehicles(vList);
        setGroups(gList);
        setBrands(bList);
        setCategories(cList);
      } catch (err) {
        console.error('Failed to load vehicles data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter & Sort Logic
  const filteredVehiclesWithGroups = vehicles
    .map((v) => {
      // Find matching group for this vehicle, matching location preference
      const matchingGroups = groups.filter((g) => g.vehicle_id === v.id);
      let primaryGroup = matchingGroups[0];

      if (selectedLocation !== 'All Locations') {
        const locMatch = matchingGroups.find((g) =>
          g.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
        if (locMatch) primaryGroup = locMatch;
      }

      return { vehicle: v, group: primaryGroup };
    })
    .filter(({ vehicle, group }) => {
      // Category Tab
      if (activeTab === 'electric') {
        if (vehicle.fuel_type !== 'Electric') return false;
      } else if (activeTab !== 'all') {
        if (vehicle.category?.slug !== activeTab) return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && vehicle.brand_id !== selectedBrand) return false;

      // Fuel filter
      if (selectedFuel !== 'all' && vehicle.fuel_type.toLowerCase() !== selectedFuel.toLowerCase()) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All Locations' && group) {
        if (!group.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all' && group) {
        if (group.status !== selectedStatus) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = vehicle.name.toLowerCase().includes(q);
        const matchesBrand = vehicle.brand?.name.toLowerCase().includes(q);
        const matchesLoc = group?.location.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesLoc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'members') {
        const membersA = a.group?.current_members || 0;
        const membersB = b.group?.current_members || 0;
        return membersB - membersA;
      }
      if (sortBy === 'price_asc') {
        return a.vehicle.starting_price - b.vehicle.starting_price;
      }
      if (sortBy === 'price_desc') {
        return b.vehicle.starting_price - a.vehicle.starting_price;
      }
      // 'popular' default: rank by group members and completion
      const scoreA = (a.group?.current_members || 0) / (a.group?.minimum_members || 1);
      const scoreB = (b.group?.current_members || 0) / (b.group?.minimum_members || 1);
      return scoreB - scoreA;
    });

  const resetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedFuel('all');
    setSelectedStatus('all');
    setSelectedLocation('All Locations');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Live Regional Groups
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Explore Vehicles</h1>
              <p className="text-sm text-slate-500">
                Join verified buyer groups, view live progress, and lock in group negotiation power.
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="members">Most Members Joined</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Segment Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-2 border-b border-slate-200">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'car', label: 'Cars', fee: '₹499' },
              { id: 'bike', label: 'Bikes', fee: '₹299' },
              { id: 'scooter', label: 'Scooters', fee: '₹199' },
              { id: 'auto', label: 'Auto / 3-Wheeler', fee: '₹399' },
              { id: 'electric', label: 'Electric (EV)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.fee && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.fee}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand or vehicle name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Fuel Filter */}
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Fuels</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric (EV)</option>
            </select>

            {/* Location Selector */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="All Locations">All Locations</option>
              <option value="Mangalore">Mangalore</option>
              <option value="Puttur">Puttur</option>
              <option value="BC Road">BC Road</option>
              <option value="Uppinangady">Uppinangady</option>
            </select>

            {/* Group Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Building">Building</option>
              <option value="Almost Full">Almost Full</option>
              <option value="Negotiation Ready">Negotiation Ready</option>
              <option value="Offer Received">Offer Received</option>
            </select>

            {(searchQuery || selectedBrand !== 'all' || selectedFuel !== 'all' || selectedStatus !== 'all' || selectedLocation !== 'All Locations') && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <span>
            Showing <strong className="text-slate-900">{filteredVehiclesWithGroups.length}</strong> vehicle groups
          </span>
          <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            3-Month Refund Guarantee Active On All Groups
          </span>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredVehiclesWithGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehiclesWithGroups.map(({ vehicle, group }) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <CarFront className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {vehicles.length === 0 ? 'Vehicle Catalog Is Currently Empty' : 'No vehicles match your criteria'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {vehicles.length === 0
                ? 'All mock data has been cleared. Use the Admin Dashboard to add new vehicles, specify trims, and launch monthly groups.'
                : "We couldn't find any vehicles or active groups matching your active search filters."}
            </p>
            <div className="flex items-center justify-center gap-2">
              {vehicles.length === 0 ? (
                <Link
                  href="/admin/vehicles"
                  className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  Go to Admin: Add Vehicle
                </Link>
              ) : (
                <button
                  onClick={resetFilters}
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading vehicles...</div>}>
      <VehiclesContent />
    </Suspense>
  );
}
