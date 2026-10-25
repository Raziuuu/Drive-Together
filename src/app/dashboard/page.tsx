'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { membershipService, dealerService, refundService } from '@/services';
import { GroupMember, DealerOffer, Refund } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Users,
  Tag,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  CarFront,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<GroupMember[]>([]);
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      setIsLoading(true);
      try {
        const [mList, oList, rList] = await Promise.all([
          membershipService.getUserMemberships(user.id),
          dealerService.getOffers(),
          refundService.getRefundsByUser(user.id),
        ]);
        setMemberships(mList);
        setOffers(oList);
        setRefunds(rList);
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  const activeMemberships = memberships.filter(
    (m) => m.membership_status === 'active' || m.membership_status === 'negotiation'
  );
  const negotiationReadyCount = memberships.filter(
    (m) => m.group?.status === 'Negotiation Ready' || m.group?.status === 'Negotiating'
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Buyer Workspace</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Welcome back, {user?.full_name || 'Member'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your joined vehicle groups, monthly cycle status, and dealership offers in one place.
          </p>
        </div>

        <Link
          href="/vehicles"
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-3 rounded-xl transition shadow-sm self-start sm:self-auto shrink-0"
        >
          <CarFront className="w-4 h-4" />
          <span>Explore More Vehicles</span>
        </Link>
      </div>

      {/* 5 Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Joined Groups</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{memberships.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">{activeMemberships.length} currently active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">In Negotiation</span>
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{negotiationReadyCount}</span>
          <span className="text-[11px] text-slate-500 font-medium">Dealer discussions live</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Offers Received</span>
            <Tag className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{offers.length}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Verified discounts ready</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Refund Status</span>
            <RefreshCcw className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{refunds.length}</span>
          <span className="text-[11px] text-slate-500 font-medium">100% protection active</span>
        </div>
      </div>

      {/* Active Groups Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Active Buyer Groups</h2>
            <p className="text-xs text-slate-500">Live progress of groups where your membership is active</p>
          </div>
          <Link
            href="/dashboard/groups"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeMemberships.length > 0 ? (
          <div className="space-y-4">
            {activeMemberships.map((mem) => {
              const group = mem.group;
              const vehicle = group?.vehicle;
              if (!group || !vehicle) return null;

              return (
                <div
                  key={mem.id}
                  className="p-5 rounded-2xl border border-slate-200/90 hover:border-emerald-600/50 bg-slate-50/50 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                      <Image src={vehicle.image_url} alt={vehicle.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{vehicle.name}</span>
                        <StatusBadge status={group.status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{group.location}</span>
                        <span className="text-slate-300">•</span>
                        <span>Cycle #{group.cycle_number} of 3</span>
                      </p>
                      <p className="text-xs text-emerald-800 font-medium mt-1">
                        Selected: {mem.preferred_variant} ({mem.purchase_timeline})
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-64 space-y-2 shrink-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">
                        {group.current_members} / {group.minimum_members} joined
                      </span>
                      <span className="text-slate-500">
                        {Math.max(0, group.minimum_members - group.current_members)} needed
                      </span>
                    </div>
                    <ProgressBar current={group.current_members} total={group.minimum_members} size="sm" />
                  </div>

                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
                  >
                    <span>Group Page</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
            <CarFront className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active groups joined yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find a car, bike, scooter, or commercial auto you wish to purchase and become a verified group member.
            </p>
            <Link
              href="/vehicles"
              className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200"
            >
              Explore Vehicles Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
