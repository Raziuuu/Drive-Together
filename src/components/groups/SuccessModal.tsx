import React from 'react';
import Link from 'next/link';
import { Group, Vehicle } from '@/types';
import { CheckCircle2, Users, ArrowRight, Building2, Calendar, Sparkles } from 'lucide-react';

interface SuccessModalProps {
  group?: Group;
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  monthName?: string;
  showroomName?: string;
  colorName?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  group,
  vehicle,
  isOpen,
  onClose,
  monthName,
  showroomName,
  colorName,
}) => {
  if (!isOpen) return null;

  const currentMembers = group?.current_members || 1;
  const displayMonth = monthName || group?.month_name || 'November 2026';
  const displayShowroom = showroomName || 'Selected Authorized Partner Showroom';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center p-7 sm:p-9">
        {/* Large professional success badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Membership Confirmed</span>
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          You&apos;re officially in the group!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-sm mx-auto">
          Your <strong className="text-slate-900">{vehicle.name}</strong> group membership for{' '}
          <strong className="text-emerald-800">{displayMonth}</strong> is active.
        </p>

        {/* Selected Details Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Monthly Group:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>{displayMonth}</span>
            </span>
          </div>

          <div className="flex items-start justify-between text-xs gap-2">
            <span className="text-slate-500 font-medium shrink-0">Delivery Showroom:</span>
            <span className="font-bold text-slate-900 text-right flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>{displayShowroom}</span>
            </span>
          </div>

          {colorName && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Selected Color:</span>
              <span className="font-bold text-slate-900">{colorName}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Group Capacity:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              No Member Limit
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-medium">3-Month Guarantee:</span>
            <span className="font-semibold text-slate-700">100% Refundable if unfulfilled</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-2">
          <Link
            href="/dashboard/groups"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition shadow-sm text-sm"
          >
            <span>Go to My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/vehicles"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold py-2.5 rounded-xl transition text-xs"
          >
            <span>Explore More Vehicles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
