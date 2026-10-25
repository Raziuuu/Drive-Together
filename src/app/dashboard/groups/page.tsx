'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { membershipService } from '@/services';
import { GroupMember } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Users,
  MapPin,
  Calendar,
  CreditCard,
  RefreshCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CarFront,
} from 'lucide-react';

export default function MyGroupsPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMemberships() {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await membershipService.getUserMemberships(user.id);
        setMemberships(list);
      } catch (err) {
        console.error('Failed to load memberships', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMemberships();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Participation Portfolio</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">My Joined Buyer Groups</h1>
        <p className="text-xs text-slate-500 mt-1">
          Each group membership is separate, with dedicated 3-month cycle carry-over and refund protections.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : memberships.length > 0 ? (
        <div className="space-y-6">
          {memberships.map((mem) => {
            const group = mem.group;
            const vehicle = group?.vehicle;
            if (!group || !vehicle) return null;

            const isRefundState =
              mem.membership_status === 'refund_pending' || mem.membership_status === 'refunded';

            return (
              <div
                key={mem.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Top header bar */}
                <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-500">Membership ID: {mem.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">
                      Enrolled on {new Date(mem.joined_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={group.status} size="sm" />
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        mem.membership_status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mem.membership_status === 'negotiation'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {mem.membership_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Main Card Body */}
                <div className="p-6 sm:p-7 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Vehicle Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                        <Image src={vehicle.image_url} alt={vehicle.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase">{vehicle.brand?.name}</span>
                        <h3 className="text-lg font-bold text-slate-900">{vehicle.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{group.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Membership Fee info */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left md:text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Group Membership Fee</span>
                      <span className="text-lg font-bold text-slate-900">₹{group.membership_fee} Paid</span>
                      <span className="text-[11px] text-emerald-700 font-medium block">Non-booking participation fee</span>
                    </div>
                  </div>

                  {/* Group Progress Metric */}
                  <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>
                          {group.current_members} of {group.minimum_members} serious buyers
                        </span>
                      </span>
                      <span className="text-slate-500">
                        Month #{group.cycle_number} of {group.maximum_cycles}
                      </span>
                    </div>
                    <ProgressBar current={group.current_members} total={group.minimum_members} size="md" />
                  </div>

                  {/* Member Preferences Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Month</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{mem.selected_month || group.month_name || 'November 2026'}</span>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Showroom</span>
                      <span className="font-bold text-slate-800 truncate block mt-0.5">
                        {mem.selected_showroom || 'Authorized Brand Showroom'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Variant</span>
                      <span className="font-bold text-slate-800 truncate block mt-0.5">{mem.preferred_variant}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Selected Color</span>
                      <span className="font-bold text-slate-800 truncate block mt-0.5">
                        {mem.preferred_color || 'Standard Paint'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Timeline</span>
                      <span className="font-bold text-slate-800 block mt-0.5">{mem.purchase_timeline}</span>
                    </div>
                  </div>

                  {/* Refund Notice (if failed or refund processing) */}
                  {isRefundState && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-800">
                        <RefreshCcw className="w-4 h-4 text-rose-600" />
                        <span>100% Group Membership Fee Protection Activated</span>
                      </div>
                      <p className="leading-relaxed text-rose-800/90">
                        This group did not reach the minimum threshold of serious buyers within the full 3-month cycle. Your ₹{group.membership_fee} membership fee refund is currently{' '}
                        <strong className="underline">
                          {mem.membership_status === 'refunded' ? 'COMPLETED' : 'PROCESSING'}
                        </strong>.
                      </p>
                    </div>
                  )}

                  {/* Dealer Offer Link (if in negotiation / offer received) */}
                  {group.status === 'Offer Received' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>
                          <strong>Negotiated Offer Ready:</strong> Up to ₹20,000 off standard showroom price!
                        </span>
                      </div>
                      <Link
                        href="/dashboard/offers"
                        className="font-bold text-emerald-800 hover:underline shrink-0"
                      >
                        Review Offer Details →
                      </Link>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      Automatic 3-month protection guarantee active
                    </span>

                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <span>View Public Group Status</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No vehicle buyer groups joined yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Choose any car, motorcycle, scooter, or auto to become a verified group member.
          </p>
          <Link
            href="/vehicles"
            className="inline-block mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200"
          >
            Find Vehicles to Join
          </Link>
        </div>
      )}
    </div>
  );
}
