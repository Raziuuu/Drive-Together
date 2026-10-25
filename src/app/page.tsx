'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { groupService, vehicleService } from '@/services';
import { Group, Vehicle, VehicleCategory } from '@/types';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  CarFront,
  Bike,
  Search,
  MapPin,
  ShieldCheck,
  Users,
  BadgePercent,
  Sparkles,
  ArrowRight,
  Clock,
  RefreshCcw,
  Building2,
  CheckCircle,
  HelpCircle,
  Flame,
  Zap,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, selectedLocation, setSelectedLocation } = useAuth();

  // Redirect unauthenticated visitors to start with Sign Up / Login
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [featuredGroups, setFeaturedGroups] = useState<Group[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, groups, vechs] = await Promise.all([
        vehicleService.getCategories(),
        groupService.getGroups(),
        vehicleService.getVehicles(),
      ]);
      setCategories(cats);
      setFeaturedGroups(groups);
      setVehicles(vechs);
    } catch (err) {
      console.error('Failed to load homepage data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('drivetogether_store_update', handleUpdate);
    return () => {
      window.removeEventListener('drivetogether_store_update', handleUpdate);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/vehicles');
    }
  };

  const filteredGroups = featuredGroups.filter((g) => {
    const matchesCategory =
      selectedCategoryTab === 'all' ||
      (selectedCategoryTab === 'electric'
        ? g.vehicle?.fuel_type === 'Electric'
        : g.vehicle?.category?.slug === selectedCategoryTab);

    const matchesLocation =
      selectedLocation === 'All Locations' ||
      g.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesCategory && matchesLocation;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-white pt-12 pb-20 border-b border-slate-200 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Value proposition pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>India’s First Verified Vehicle Group-Buying Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Buy Together. <br />
              <span className="text-emerald-700">Save More.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Bring serious buyers together, combine your purchasing power, and negotiate stronger vehicle discounts with authorized dealerships across <strong>Mangalore, Puttur, BC Road & Uppinangady</strong>.
            </p>

            {/* Global Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-8 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-2 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search cars, bikes, scooters or autos (e.g. Creta, Activa, Nexon)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none hover:bg-slate-100 transition cursor-pointer"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Mangalore">Mangalore</option>
                  <option value="Puttur">Puttur</option>
                  <option value="BC Road">BC Road</option>
                  <option value="Uppinangady">Uppinangady</option>
                </select>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-sm"
                >
                  <span>Find Groups</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Category Quick Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Popular categories:</span>
              <button
                onClick={() => setSelectedCategoryTab('car')}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Cars (₹499 fee)
              </button>
              <button
                onClick={() => setSelectedCategoryTab('bike')}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Bikes (₹299 fee)
              </button>
              <button
                onClick={() => setSelectedCategoryTab('scooter')}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Scooters (₹199 fee)
              </button>
              <button
                onClick={() => setSelectedCategoryTab('auto')}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                Auto / 3-Wheelers (₹399 fee)
              </button>
              <button
                onClick={() => setSelectedCategoryTab('electric')}
                className="text-xs px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium transition"
              >
                EVs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STATS STRIP */}
      <section className="bg-slate-900 text-white py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-2xl sm:text-3xl font-black">
                <Users className="w-6 h-6 shrink-0" />
                <span>2,450+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified Buyers Joined</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-2xl sm:text-3xl font-black">
                <CarFront className="w-6 h-6 shrink-0" />
                <span>38+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Vehicle Groups</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-2xl sm:text-3xl font-black">
                <Building2 className="w-6 h-6 shrink-0" />
                <span>45+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Authorized Dealerships</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-2xl sm:text-3xl font-black">
                <BadgePercent className="w-6 h-6 shrink-0" />
                <span>₹1.8 Cr+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Group Savings Generated</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SELECTOR CARDS */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Browse by Segment</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Categories</h2>
            </div>
            <Link
              href="/vehicles"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>View All Vehicles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const isSelected = selectedCategoryTab === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(isSelected ? 'all' : cat.slug)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {cat.slug === 'car' ? (
                        <CarFront className="w-6 h-6" />
                      ) : cat.slug === 'bike' ? (
                        <Bike className="w-6 h-6" />
                      ) : cat.slug === 'scooter' ? (
                        <Zap className="w-6 h-6" />
                      ) : (
                        <CarFront className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      ₹{cat.membership_fee} fee
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. ACTIVE GROUPS & POPULAR VEHICLES */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-2">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Buyer Aggregations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Vehicle Buyer Groups
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Showing genuine buyer groups currently open for participation in {selectedLocation}.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'car', 'bike', 'scooter', 'auto'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl capitalize transition shrink-0 ${
                    selectedCategoryTab === tab
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'all' ? 'All Groups' : tab}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.slice(0, 6).map((group) => {
                if (!group.vehicle) return null;
                return <VehicleCard key={group.id} vehicle={group.vehicle} group={group} />;
              })}
            </div>
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.slice(0, 6).map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-4">
              <CarFront className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Vehicles or Groups Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All mock data is removed. Admin can add vehicles, define trims, create monthly groups, and enroll partner showrooms directly from the Admin Dashboard.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/admin/vehicles"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle in Admin Console</span>
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm"
                >
                  <span>Open Admin Dashboard</span>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition shadow-sm"
            >
              <span>Explore All Vehicle Groups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION (Section 22 of User Request) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Transparent 5-Step Process
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              How DriveTogether Works
            </h2>
            <p className="text-sm text-slate-600">
              A fair, simple mechanism to turn individual buyer demand into serious collective bargaining power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-2xl font-black text-slate-200 block">01</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Find Your Vehicle</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose the car, motorcycle, scooter, or commercial auto you are genuinely planning to buy.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-2xl font-black text-slate-200 block">02</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Join a Group</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pay the one-time Group Membership Fee (₹199 – ₹499) to verify you are a genuine buyer.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-2xl font-black text-slate-200 block">03</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Build the Group</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  More serious regional buyers join. If monthly threshold isn't met, you roll forward for up to 3 months.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-2xl font-black text-slate-200 block">04</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">We Negotiate</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Our corporate negotiation team presents the combined bulk demand to authorized brand dealerships.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm relative flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-2xl font-black text-slate-200 block">05</span>
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Get the Best Deal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You receive the negotiated fleet discount voucher and purchase directly with dealership confidence.
                </p>
              </div>
            </div>
          </div>

          {/* 3-Month Protection Guarantee Highlight */}
          <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Our 3-Month Membership Fee Protection Guarantee
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  If your vehicle group does not reach the required minimum number of verified serious buyers within the complete 3-month window, <strong>100% of your Group Membership Fee is refunded</strong> back to your payment source. Zero risk.
                </p>
              </div>
            </div>

            <Link
              href="/how-it-works"
              className="shrink-0 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200"
            >
              Read Full Policy
            </Link>
          </div>
        </div>
      </section>

      {/* 6. WHY DRIVETOGETHER (Value Pillars) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Pillars</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Why Dealerships Offer Us Fleet Pricing
            </h2>
            <p className="text-sm text-slate-600">
              Dealerships usually ignore online "interested" leads because 95% never buy. DriveTogether solves this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">100% Serious Buyers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                By charging a small Group Membership Fee, we filter out casual browsers. Dealerships know every member in our group has skin in the game and is ready to buy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Unmatched Bargaining Power</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One buyer negotiating alone receives token showroom discounts. 30 to 50 buyers negotiating together unlock institutional corporate and fleet rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Official Dealership Invoicing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                DriveTogether does not sell vehicles or hold booking amounts. You purchase directly from authorized brand showrooms with all standard manufacturer warranties intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REGIONAL LOCATIONS FOCUS */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Initial Geography</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Active Regional Hubs
            </h2>
            <p className="text-sm text-slate-600">
              Select your region to see local dealership tie-ups and nearby vehicle groups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Mangalore',
                desc: 'Main urban hub with primary dealer networks for Hyundai, Tata, Maruti, Royal Enfield & EV brands.',
                activeGroups: 16,
                buyers: 780,
              },
              {
                name: 'Puttur',
                desc: 'Active commercial hub with high demand for compact SUVs, commuter bikes & commercial autos.',
                activeGroups: 10,
                buyers: 490,
              },
              {
                name: 'BC Road',
                desc: 'Central junction serving Bantwal & surroundings with established Maruti & Royal Enfield clusters.',
                activeGroups: 8,
                buyers: 340,
              },
              {
                name: 'Uppinangady',
                desc: 'Growing rural-town aggregation hub with high demand for 125cc scooters & commercial vehicles.',
                activeGroups: 6,
                buyers: 220,
              },
            ].map((loc) => (
              <div
                key={loc.name}
                onClick={() => {
                  setSelectedLocation(loc.name);
                  router.push(`/vehicles?location=${loc.name}`);
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-slate-900 text-base">{loc.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{loc.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
                  <span>{loc.activeGroups} active groups</span>
                  <span className="text-emerald-700 font-bold">{loc.buyers}+ buyers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION */}
      <section className="py-20 bg-emerald-800 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-200 px-3.5 py-1.5 rounded-full border border-emerald-700">
            Start Saving Today
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Your next vehicle could cost less <br />
            when you buy together.
          </h2>

          <p className="text-base text-emerald-100 max-w-xl mx-auto">
            Join hundreds of serious buyers in Coastal Karnataka combining their purchasing power right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/vehicles"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-8 py-3.5 rounded-xl transition shadow-lg text-sm"
            >
              <span>Explore Vehicle Groups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-700/80 font-semibold px-8 py-3.5 rounded-xl transition text-sm"
            >
              <span>Learn More</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
