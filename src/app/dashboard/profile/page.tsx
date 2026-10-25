'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services';
import { User, Phone, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUserData } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [city, setCity] = useState(user?.city || 'Mangalore');
  const [area, setArea] = useState(user?.area || 'Kadri');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await authService.updateProfile({
      full_name: fullName,
      city,
      area,
    });
    refreshUserData();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Account Details</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Buyer Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact credentials and regional delivery preferences for vehicle group negotiations.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Registered Mobile</label>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-sm">
              <span className="px-3.5 py-2.5 text-slate-500 font-mono select-none">
                {user?.phone_number}
              </span>
              <span className="ml-auto px-3.5 py-2.5 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>OTP Verified</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Mobile number is tied to your active group booking records and OTP authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Primary City / Hub</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-600 outline-none bg-white"
              >
                <option value="Mangalore">Mangalore</option>
                <option value="Puttur">Puttur</option>
                <option value="BC Road">BC Road</option>
                <option value="Uppinangady">Uppinangady</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Locality / Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Hampankatta, Kadri, Darbe..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
