'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService, groupService, vehicleService, dealerService } from '@/services';
import { AdminOverviewStats } from '@/services/adminService';
import { Group, Vehicle, Dealer } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Users,
  CarFront,
  Sparkles,
  CreditCard,
  RefreshCcw,
  Building2,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Clock,
  Trash2,
  Database,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [s, gList, vList, dList] = await Promise.all([
        adminService.getOverviewStats(),
        groupService.getGroups(),
        vehicleService.getVehicles(),
        dealerService.getDealers(),
      ]);
      setStats(s);
      setGroups(gList);
      setVehicles(vList);
      setDealers(dList);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleClearMockData = async () => {
    if (!confirm('Are you sure you want to remove all mock data? This will clear all vehicles, monthly groups, partner showrooms, and demo memberships so you can start with a clean website.')) {
      return;
    }
    await adminService.clearAllMockData();
    setMessage('All mock data has been wiped clean! You can now add your own vehicles, groups, and partner showrooms.');
    loadAdminData();
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLoadStarterData = async () => {
    if (!confirm('Load realistic starter template data (vehicles, groups, showrooms, and sample offers)?')) {
      return;
    }
    await adminService.loadStarterData();
    setMessage('Starter template data loaded successfully!');
    loadAdminData();
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header & Data Control Center */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Platform Operational Metrics</h2>
          <p className="text-xs text-slate-400 mt-1">
            Control website data, manage buyer group demand, and configure partner showrooms.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleClearMockData}
            className="inline-flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Mock Data (Start Fresh)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadStarterData}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Load Starter Template Data</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Quick Access Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/vehicles"
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500 transition group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <CarFront className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-emerald-400 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <span className="text-xl font-bold text-white block">{vehicles.length} Vehicles</span>
            <span className="text-xs text-slate-400">Add, edit, remove models & category pricing</span>
          </div>
        </Link>

        <Link
          href="/admin/groups"
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500 transition group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-emerald-400 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <span className="text-xl font-bold text-white block">{groups.length} Monthly Groups</span>
            <span className="text-xs text-slate-400">Create months, edit thresholds & advance cycles</span>
          </div>
        </Link>

        <Link
          href="/admin/dealers"
          className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-emerald-500 transition group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-emerald-400 flex items-center gap-1">
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <span className="text-xl font-bold text-white block">{dealers.length} Showrooms</span>
            <span className="text-xs text-slate-400">Add partner dealers & publish fleet discounts</span>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Live Vehicles</span>
          <span className="text-2xl font-black text-white block">{vehicles.length}</span>
          <span className="text-[11px] text-emerald-400">In website catalog</span>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Monthly Groups</span>
          <span className="text-2xl font-black text-white block">{groups.length}</span>
          <span className="text-[11px] text-emerald-400">Active enrollments</span>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Partner Showrooms</span>
          <span className="text-2xl font-black text-emerald-400 block">{dealers.length}</span>
          <span className="text-[11px] text-slate-400">Coastal Karnataka</span>
        </div>

        <div className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-semibold uppercase text-slate-400">Active Dealer Offers</span>
          <span className="text-2xl font-black text-purple-400 block">{stats?.offersReceived || 0}</span>
          <span className="text-[11px] text-slate-400">Fleet vouchers</span>
        </div>
      </div>

      {/* Recent Groups Table */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Current Vehicle Buyer Groups
          </h3>
          <Link
            href="/admin/groups"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Groups</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs space-y-2">
            <p>No groups in the database.</p>
            <Link
              href="/admin/groups"
              className="text-emerald-400 hover:underline font-semibold"
            >
              Create your first group
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="bg-slate-900/60 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4">Enrolled / Threshold</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Cycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {groups.slice(0, 5).map((g) => (
                  <tr key={g.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-bold text-white">
                      {g.vehicle?.name || g.vehicle_id}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-medium">
                      {g.month_name || 'November 2026'}
                    </td>
                    <td className="py-3 px-4">
                      {g.current_members} / {g.minimum_members} buyers
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={g.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      Month #{g.cycle_number} of 3
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
