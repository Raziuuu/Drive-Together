'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { groupService, membershipService } from '@/services';
import { Vehicle, Group, GroupMember } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { JoinGroupModal } from '@/components/groups/JoinGroupModal';
import { SuccessModal } from '@/components/groups/SuccessModal';
import {
  CarFront,
  ShieldCheck,
  Users,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  HelpCircle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  RefreshCcw,
} from 'lucide-react';

interface VehicleDetailClientProps {
  vehicle: Vehicle;
  initialGroups: Group[];
}

export function VehicleDetailClient({
  vehicle,
  initialGroups,
}: VehicleDetailClientProps) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(initialGroups[0] || null);
  const [userMembership, setUserMembership] = useState<GroupMember | null>(null);

  // Modal states
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [joinedDetails, setJoinedDetails] = useState<{
    month: string;
    showroom: string;
    color?: string;
  } | null>(null);

  // Check if current user is already a member of the selected group
  useEffect(() => {
    async function checkMembership() {
      if (user && selectedGroup) {
        const mem = await membershipService.getMembershipByGroup(user.id, selectedGroup.id);
        setUserMembership(mem);
      } else {
        setUserMembership(null);
      }
    }
    checkMembership();
  }, [user, selectedGroup]);

  const membershipFee = vehicle.category?.membership_fee || 499;
  const activeGroup = selectedGroup || groups[0];
  const groupMetrics = activeGroup ? groupService.getGroupProgress(activeGroup) : null;
  const availableMonths = groupService.getAvailableMonths();

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/vehicles" className="hover:text-slate-800">Vehicles</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-semibold text-slate-900">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Vehicle Gallery & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Image */}
            <div className="relative h-80 sm:h-96 w-full bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <Image
                src={vehicle.image_url}
                alt={vehicle.name}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-bold uppercase bg-white/95 text-slate-900 px-3 py-1 rounded-full shadow-sm">
                  {vehicle.fuel_type}
                </span>
              </div>
            </div>

            {/* Vehicle Header Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {vehicle.brand?.name}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {vehicle.name}
                  </h1>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Starting Showroom Price</span>
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{(vehicle.starting_price / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {vehicle.description}
              </p>

              {/* Quick Specs Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Category</span>
                  <span className="text-xs font-bold text-slate-800">{vehicle.category?.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Powertrain</span>
                  <span className="text-xs font-bold text-slate-800">{vehicle.fuel_type}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Group Entry Fee</span>
                  <span className="text-xs font-bold text-emerald-700">₹{membershipFee}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Dealer Protection</span>
                  <span className="text-xs font-bold text-slate-800">3-Month Guarantee</span>
                </div>
              </div>
            </div>

            {/* Factory Colors & Exterior Finishes */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Factory Colors & Exterior Finishes ({vehicle.colors.length})
                  </h3>
                  <span className="text-xs text-slate-500">Available at partner showrooms</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {vehicle.colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-500/50 transition shadow-2xs"
                    >
                      <span
                        className="w-7 h-7 rounded-full border-2 border-white shadow-md shrink-0 ring-1 ring-slate-200"
                        style={{ backgroundColor: c.hex || '#ffffff' }}
                      />
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants & Pricing Table */}
            {vehicle.variants && vehicle.variants.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900">Available Variants & Trims</h3>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {vehicle.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-slate-50 transition"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{variant.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Object.entries(variant.specifications || {}).map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                            >
                              <strong>{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs text-slate-400 block">Ex-Showroom</span>
                        <span className="text-sm font-bold text-slate-900">
                          ₹{(variant.ex_showroom_price / 100000).toFixed(2)} Lakh
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          On-Road est: ~₹{(variant.on_road_estimate / 100000).toFixed(2)} Lakh
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 19: Clear Visual Steps */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-700" />
                <span>What happens after I join this group?</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>1. Verified Group Member</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You become part of the verified buyer pool for {vehicle.name}. The fee ensures no fake or casual users pollute group numbers.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>2. Automatic Rollover</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If minimum buyer count isn't reached in month 1, you automatically continue into month 2 and month 3 without paying any extra fee.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>3. Dealership Negotiation</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Once minimum members join, DriveTogether approaches regional dealerships to negotiate authentic fleet discount packages.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <RefreshCcw className="w-4 h-4 text-emerald-600" />
                    <span>4. 100% Refund Guarantee</span>
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If the group does not reach minimum size after 3 full months, your ₹{membershipFee} fee is automatically refunded.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Group Buying Status & Join CTA (5 cols sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            {activeGroup ? (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-600/30 shadow-lg shadow-emerald-900/5 space-y-6">
                {/* Header Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Group Buying Enrollment
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                      No Group Size Limit
                    </span>
                  </div>
                  <StatusBadge status={activeGroup.status} />
                </div>

                {/* Monthly Group Selection Preview */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Available Monthly Groups:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {availableMonths.map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => {
                          groupService.getOrCreateMonthlyGroup(vehicle.id, m.name).then((g) => {
                            setSelectedGroup(g);
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition ${
                          (activeGroup?.month_name || 'November 2026') === m.name
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block truncate">{m.name}</span>
                        <span className="text-[10px] font-normal text-slate-500">Open Group</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Member Counts & Progress */}
                <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-slate-900">
                        {activeGroup.current_members}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        verified buyers enrolled
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                      Active Pool
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Coastal Karnataka Region</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      {activeGroup.month_name || 'November 2026'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug pt-1">
                    Every additional member adds volume bargaining power with regional partner showrooms.
                  </p>
                </div>

                {/* Savings estimate */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      Potential Fleet Savings
                    </span>
                    <span className="text-lg font-black text-emerald-900">
                      Up to ₹45,000 – ₹75,000*
                    </span>
                  </div>
                  <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>

                {/* Membership Fee Box */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                      Group Membership Fee
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-slate-900">₹{membershipFee}</span>
                      <span className="text-xs text-slate-500">(1-time • 100% Refundable)</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 text-right max-w-[130px]">
                    Pick month & showroom on next step
                  </span>
                </div>

                {/* CTA Button */}
                {userMembership ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>You are an active member of this group!</span>
                    </div>
                    <Link
                      href="/dashboard/groups"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition text-sm shadow-sm"
                    >
                      <span>View Group in Dashboard</span>
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setJoinModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl transition shadow-md text-base hover:scale-[1.01] cursor-pointer"
                  >
                    <span>Join Group — Pick Month & Showroom</span>
                  </button>
                )}

                <div className="text-center">
                  <a
                    href="tel:+918242980044"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Have questions? Talk to our team</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center space-y-3">
                <p className="text-xs text-slate-500">No active regional group currently open for this vehicle.</p>
              </div>
            )}

            {/* Regional dealership trust badge */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Verified Dealership Delivery</strong>
                <span>All purchases happen at authorized brand showrooms in Mangalore, Puttur & BC Road with full manufacturer warranty.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Group Checkout Modal */}
      {activeGroup && (
        <JoinGroupModal
          group={activeGroup}
          vehicle={vehicle}
          isOpen={joinModalOpen}
          onClose={() => setJoinModalOpen(false)}
          initialMonth={activeGroup.month_name}
          onSuccess={(memberId, monthName, showroomName, colorName) => {
            setJoinModalOpen(false);
            setJoinedDetails({ month: monthName, showroom: showroomName, color: colorName });
            setSuccessModalOpen(true);
            groupService.getGroupById(activeGroup.id).then((g) => {
              if (g) setSelectedGroup(g);
            });
            if (user) {
              membershipService.getMembershipByGroup(user.id, activeGroup.id).then((m) => {
                setUserMembership(m);
              });
            }
          }}
        />
      )}

      {/* Payment Success Confirmation Modal */}
      {activeGroup && (
        <SuccessModal
          group={activeGroup}
          vehicle={vehicle}
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          monthName={joinedDetails?.month}
          showroomName={joinedDetails?.showroom}
          colorName={joinedDetails?.color}
        />
      )}
    </div>
  );
}
