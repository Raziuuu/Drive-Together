'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Users, CarFront, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LocationsPage() {
  const router = useRouter();
  const { setSelectedLocation } = useAuth();

  const locations = [
    {
      name: 'Mangalore',
      tagline: 'Coastal Commercial & Automotive Epicenter',
      description: 'Major regional authorized dealer headquarters for Maruti Nexa, Hyundai, Tata Motors, Kia, Honda, Yamaha, Ather, and Royal Enfield.',
      stats: {
        activeGroups: 16,
        verifiedBuyers: 780,
        dealerships: 24,
      },
      popularVehicles: ['Hyundai Creta', 'Kia Seltos', 'Ather 450X', 'Tata Nexon'],
      featuredDealers: ['Advaith Hyundai Coastal', 'Mandovi Motors', 'Miven Royal Enfield'],
    },
    {
      name: 'Puttur',
      tagline: 'High-Demand Commercial & Commuter Market',
      description: 'Dynamic market with robust demand for compact SUVs, 125cc commuter motorcycles, and commercial passenger autos.',
      stats: {
        activeGroups: 10,
        verifiedBuyers: 490,
        dealerships: 12,
      },
      popularVehicles: ['Tata Nexon', 'Yamaha FZ', 'Bajaj RE Auto', 'Honda Shine'],
      featuredDealers: ['Cauvery Tata Motors', 'Puttur Yamaha Hub', 'Bajaj Commercials'],
    },
    {
      name: 'BC Road',
      tagline: 'Strategic Bantwal Junction Hub',
      description: 'Centrally located transit corridor aggregating buyers from Bantwal, Panemangalore, and surrounding taluks with active car and retro motorcycle groups.',
      stats: {
        activeGroups: 8,
        verifiedBuyers: 340,
        dealerships: 9,
      },
      popularVehicles: ['Maruti Grand Vitara', 'Royal Enfield Classic 350', 'TVS Jupiter'],
      featuredDealers: ['Mandovi Motors BC Road', 'Sri Krishna Auto Hub'],
    },
    {
      name: 'Uppinangady',
      tagline: 'Rapidly Growing Rural-Urban Cluster',
      description: 'Key junction point for Belthangady and Subrahmanya regions with strong buyer aggregations for scooters and commercial passenger transport.',
      stats: {
        activeGroups: 6,
        verifiedBuyers: 220,
        dealerships: 7,
      },
      popularVehicles: ['Honda Activa 125', 'TVS Ntorq', 'Bajaj Maxima'],
      featuredDealers: ['Shree Krishna Honda', 'Uppinangady Motors'],
    },
  ];

  const handleSelect = (locName: string) => {
    setSelectedLocation(locName);
    router.push(`/vehicles?location=${encodeURIComponent(locName)}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Regional Presence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Choose Your Location
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            DriveTogether is currently live across key commercial hubs in Dakshina Kannada. Select your region to connect with verified buyers and nearby authorized dealerships.
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {locations.map((loc) => (
            <div
              key={loc.name}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition p-6 sm:p-8 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{loc.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{loc.tagline}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active Hub
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{loc.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-lg font-bold text-slate-900 block">{loc.stats.activeGroups}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Active Groups</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-emerald-700 block">{loc.stats.verifiedBuyers}+</span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Buyers Joined</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 block">{loc.stats.dealerships}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Tie-up Dealers</span>
                  </div>
                </div>

                {/* Popular Vehicles */}
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                    Popular in {loc.name}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {loc.popularVehicles.map((veh) => (
                      <span
                        key={veh}
                        className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium"
                      >
                        {veh}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelect(loc.name)}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition text-xs shadow-sm"
              >
                <span>View {loc.name} Vehicle Groups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
