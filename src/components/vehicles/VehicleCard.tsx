'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Vehicle, Group } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { JoinGroupModal } from '@/components/groups/JoinGroupModal';
import { SuccessModal } from '@/components/groups/SuccessModal';
import {
  MapPin,
  Users,
  ArrowRight,
  Fuel,
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  group?: Group;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, group }) => {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [joinedDetails, setJoinedDetails] = useState<{
    month: string;
    showroom: string;
    color?: string;
  } | null>(null);

  // Estimated discount calculation based on category
  const getEstimatedSavings = () => {
    switch (vehicle.category?.slug) {
      case 'car':
        return '₹40,000 – ₹75,000*';
      case 'bike':
        return '₹8,000 – ₹15,000*';
      case 'scooter':
        return '₹5,000 – ₹10,000*';
      case 'auto':
        return '₹15,000 – ₹25,000*';
      default:
        return 'Up to 10%*';
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const membershipFee = vehicle.category?.membership_fee || group?.membership_fee || 499;
  const currentMembers = group?.current_members || 24;
  const activeMonth = group?.month_name || 'November 2026';

  const handleJoinSuccess = (memberId: string, monthName: string, showroomName: string, colorName?: string) => {
    setIsJoinOpen(false);
    setJoinedDetails({ month: monthName, showroom: showroomName, color: colorName });
    setIsSuccessOpen(true);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
        {/* Vehicle Image Container */}
        <Link href={`/vehicles/${vehicle.id}`} className="relative h-52 w-full bg-slate-100 overflow-hidden block">
          <Image
            src={vehicle.image_url}
            alt={vehicle.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/95 text-slate-800 px-2.5 py-1 rounded-full shadow-sm">
              <Fuel className="w-3 h-3 text-emerald-600" />
              <span>{vehicle.fuel_type}</span>
            </span>

            <span className="text-[10px] font-bold bg-slate-900/80 text-emerald-300 backdrop-blur-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
              No Group Limit
            </span>
          </div>

          {/* Potential Savings Tag on Image */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 text-white px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bulk Savings: {getEstimatedSavings()}</span>
            </span>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Model */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {vehicle.brand?.name || 'Authorized Dealership'}
                </span>
                <Link href={`/vehicles/${vehicle.id}`}>
                  <h3 className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition">
                    {vehicle.name}
                  </h3>
                </Link>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 block">Starting at</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatPrice(vehicle.starting_price)}
                </span>
              </div>
            </div>

            {/* Color Swatches Preview */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <div className="mt-2.5 flex items-center justify-between gap-1 text-[11px] text-slate-500">
                <span className="font-medium text-slate-600">Available Colors:</span>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center -space-x-1">
                    {vehicle.colors.slice(0, 5).map((col, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs ring-1 ring-slate-200"
                        style={{ backgroundColor: col.hex || '#ffffff' }}
                        title={col.name}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {vehicle.colors.length} options
                  </span>
                </div>
              </div>
            )}

            {/* Monthly Group Status with No Limit */}
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentMembers} verified buyers enrolled</span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Open Group
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Calendar className="w-3 h-3 text-emerald-700 shrink-0" />
                  <span>{activeMonth}</span>
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Partner Showrooms</span>
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Join Group CTA */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Group Fee
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                ₹{membershipFee}
                <span className="text-[10px] font-normal text-slate-500">(Refundable)</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsJoinOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow cursor-pointer"
            >
              <span>Join Group</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Join Group Modal */}
      <JoinGroupModal
        vehicle={vehicle}
        group={group}
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleJoinSuccess}
      />

      {/* Success Modal */}
      <SuccessModal
        vehicle={vehicle}
        group={group}
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        monthName={joinedDetails?.month}
        showroomName={joinedDetails?.showroom}
        colorName={joinedDetails?.color}
      />
    </>
  );
};
