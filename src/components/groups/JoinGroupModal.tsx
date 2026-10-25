'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Group, Vehicle, PurchaseTimeline, Dealer } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { membershipService, groupService, dealerService } from '@/services';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  CreditCard,
  MapPin,
  HelpCircle,
  AlertCircle,
  Building2,
  Users,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';

interface JoinGroupModalProps {
  vehicle: Vehicle;
  group?: Group;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (memberId: string, monthName: string, showroomName: string, colorName?: string) => void;
  initialMonth?: string;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  vehicle,
  group: initialGroup,
  isOpen,
  onClose,
  onSuccess,
  initialMonth,
}) => {
  const { user, setLoginModalOpen, setPostLoginRedirect } = useAuth();

  const availableMonths = groupService.getAvailableMonths();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialMonth || initialGroup?.month_name || availableMonths[0].name
  );

  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selectedShowroomId, setSelectedShowroomId] = useState<string>('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');

  const [selectedVariant, setSelectedVariant] = useState(
    vehicle.variants?.[0]?.name || 'Standard Base Variant'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    vehicle.colors?.[0]?.name || 'Standard Factory Color'
  );
  const [purchaseTimeline, setPurchaseTimeline] = useState<PurchaseTimeline>('15–30 days');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Identify vehicle brand name
  const vehicleBrandName = vehicle.brand?.name || vehicle.name.split(' ')[0] || '';

  const isDealerBrandMatch = (dealer: Dealer) => {
    if (!vehicleBrandName) return true;
    const vb = vehicleBrandName.toLowerCase().trim();
    const dBrand = (dealer.brand || dealer.brands?.[0] || '').toLowerCase().trim();

    // Normalization for Suzuki / Maruti / Maruti Suzuki
    const isSuzuki = (s: string) => s.includes('suzuki') || s.includes('maruti');
    if (isSuzuki(vb) && (isSuzuki(dBrand) || isSuzuki(dealer.business_name))) return true;

    // Normalization for Tata / Tata Motors
    const isTata = (s: string) => s.includes('tata');
    if (isTata(vb) && (isTata(dBrand) || isTata(dealer.business_name))) return true;

    // Normalization for Royal Enfield
    const isRE = (s: string) => s.includes('royal enfield') || s.includes('enfield');
    if (isRE(vb) && (isRE(dBrand) || isRE(dealer.business_name))) return true;

    // Exact or substring match on brand or business name
    if (dBrand && (dBrand === vb || dBrand.includes(vb) || vb.includes(dBrand))) return true;
    if (
      dealer.brands &&
      dealer.brands.some((b) => {
        const bLower = b.toLowerCase().trim();
        if (isSuzuki(vb) && isSuzuki(bLower)) return true;
        if (isTata(vb) && isTata(bLower)) return true;
        return bLower === vb || bLower.includes(vb) || vb.includes(bLower);
      })
    ) {
      return true;
    }

    if (dealer.business_name.toLowerCase().includes(vb)) return true;

    return false;
  };

  // Load partner dealers and filter for vehicle brand
  useEffect(() => {
    async function loadDealers() {
      const allDealers = await dealerService.getDealers();
      setDealers(allDealers);

      // Preselect first dealer matching the exclusive vehicle brand
      const brandMatch = allDealers.find(isDealerBrandMatch);
      if (brandMatch) {
        setSelectedShowroomId(brandMatch.id);
      } else if (allDealers.length > 0) {
        setSelectedShowroomId(allDealers[0].id);
      }
    }
    if (isOpen) {
      loadDealers();
    }
  }, [isOpen, vehicle]);

  if (!isOpen) return null;

  const membershipFee = vehicle.category?.membership_fee || initialGroup?.membership_fee || 499;

  // Filter dealers: 1st by Brand exclusivity, 2nd by City Tab
  const brandAuthorizedDealers = dealers.filter(isDealerBrandMatch);
  const filteredDealers = brandAuthorizedDealers.filter((d) => {
    if (selectedCityFilter === 'All') return true;
    return d.city.toLowerCase() === selectedCityFilter.toLowerCase();
  });

  const selectedDealer =
    brandAuthorizedDealers.find((d) => d.id === selectedShowroomId) ||
    filteredDealers[0] ||
    brandAuthorizedDealers[0] ||
    dealers[0];

  const handleJoin = async () => {
    if (!user) {
      setPostLoginRedirect(`/vehicles/${vehicle.id}`);
      setLoginModalOpen(true);
      return;
    }

    if (!selectedDealer) {
      setError('Please select a partnered showroom for your vehicle delivery.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Get or dynamically initialize the group for this vehicle & selected month
      const targetGroup = await groupService.getOrCreateMonthlyGroup(vehicle.id, selectedMonth);

      // 2. Enroll the member
      const result = await membershipService.joinGroup({
        userId: user.id,
        groupId: targetGroup.id,
        preferredVariant: selectedVariant,
        preferredColor: selectedColor,
        purchaseTimeline,
        preferredLocation: selectedDealer.city,
        selectedMonth,
        selectedShowroom: `${selectedDealer.business_name} (${selectedDealer.city})`,
        showroomId: selectedDealer.id,
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }

      onSuccess(
        result.member.id,
        selectedMonth,
        `${selectedDealer.business_name} — ${selectedDealer.city}`,
        selectedColor
      );
    } catch (err: any) {
      setError(err?.message || 'Failed to join group. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                  Verified Buyer Group
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  No Member Limit
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Join {vehicle.name} Group</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Vehicle Summary Strip */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-200">
              <Image src={vehicle.image_url} alt={vehicle.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase">{vehicle.brand?.name}</span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{vehicle.name}</h4>
              <p className="text-xs text-slate-500">Starting at ₹{(vehicle.starting_price / 100000).toFixed(2)} Lakh</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Membership Fee</span>
              <span className="text-base font-bold text-emerald-700">₹{membershipFee}</span>
              <span className="text-[10px] text-slate-500 block">100% Refundable</span>
            </div>
          </div>

          {/* 1. SELECT GROUP MONTH */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>1. Select Monthly Group to Join</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Join Any Month
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Groups are organized by delivery month with <strong>no limit on group size</strong>. More buyers joining your month unlocks greater showroom fleet discounts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableMonths.map((m) => {
                const isSelected = selectedMonth === m.name;
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setSelectedMonth(m.name)}
                    className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {m.name}
                          </span>
                          {m.isCurrent && (
                            <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{m.description}</p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600 flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-emerald-700" />
                        <span>Open Group</span>
                      </span>
                      <span className="text-emerald-800 font-semibold">Unlimited Capacity</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SELECT PARTNERED SHOWROOM */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>2. Select Authorized {vehicleBrandName} Showroom</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Exclusive authorized single-brand dealership
              </span>
            </div>

            {/* City tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Mangalore', 'Puttur', 'BC Road', 'Uppinangady'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCityFilter(city)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
                    selectedCityFilter === city
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Showroom List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {filteredDealers.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center space-y-1.5">
                  <p className="text-xs text-amber-900 font-semibold">
                    No authorized {vehicleBrandName} showrooms found in {selectedCityFilter}.
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Switch to &apos;All&apos; or neighboring hubs (e.g. Mangalore / Puttur / BC Road) to pick your delivery showroom.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCityFilter('All')}
                    className="inline-block mt-1 text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    View All Authorized {vehicleBrandName} Showrooms
                  </button>
                </div>
              ) : (
                filteredDealers.map((d) => {
                  const isSelected = selectedShowroomId === d.id;
                  const dealerBrand = d.brand || d.brands?.[0] || vehicleBrandName;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedShowroomId(d.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {d.business_name}
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded">
                            Authorized {dealerBrand} Showroom
                          </span>
                          <span className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                            {d.city}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{d.address}</span>
                        </p>
                      </div>

                      <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* 3. VARIANT, COLOR & TIMELINE */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Variant */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  3. Preferred Variant / Trim
                </label>
                {vehicle.variants && vehicle.variants.length > 0 ? (
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white"
                  >
                    {vehicle.variants.map((v) => (
                      <option key={v.id} value={v.name}>
                        {v.name} (Ex-showroom: ₹{(v.ex_showroom_price / 100000).toFixed(2)} Lakh)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none"
                    placeholder="e.g. Standard Model"
                  />
                )}
              </div>

              {/* Purchase Timeline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  4. Delivery Plan
                </label>
                <select
                  value={purchaseTimeline}
                  onChange={(e) => setPurchaseTimeline(e.target.value as PurchaseTimeline)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white"
                >
                  <option value="Within 15 days">Within 15 days</option>
                  <option value="15–30 days">15–30 days</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>
            </div>

            {/* 5. Color Choice */}
            {vehicle.colors && vehicle.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span>5. Preferred Color:</span>
                    <span className="text-emerald-700 font-bold normal-case text-xs">{selectedColor}</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Official factory paint</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {vehicle.colors.map((c) => {
                    const isSelectedColor = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          isSelectedColor
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 shadow-xs ring-1 ring-white"
                          style={{ backgroundColor: c.hex || '#ffffff' }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Transparent Protection Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>DriveTogether 3-Month Protection Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              By paying this Group Membership Fee, you join the verified buyer pool for <strong>{selectedMonth}</strong> at <strong>{selectedDealer?.business_name || 'selected showroom'}</strong>. There is <strong>no limit on group size</strong>. If minimum bulk negotiation size is not achieved after 3 months, <strong>100% of your fee is refunded</strong>.
            </p>
          </div>

          {/* Payment & Action */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Selected Month & Showroom:</span>
              <span className="font-bold text-slate-900 text-right">
                {selectedMonth} • {selectedDealer?.business_name}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Selected Trim & Color:</span>
              <span className="font-bold text-slate-900 text-right">
                {selectedVariant} • {selectedColor}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Group Membership Fee:</span>
              <span className="text-xl font-black text-slate-900">₹{membershipFee}</span>
            </div>

            {!user && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2">
                <span>Sign in with your mobile number to enroll in this group.</span>
                <Link
                  href={`/login?redirect=/vehicles/${vehicle.id}`}
                  className="font-bold text-emerald-800 underline shrink-0"
                >
                  Sign In
                </Link>
              </div>
            )}

            <button
              onClick={handleJoin}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition shadow-md text-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Processing Payment...'
                  : !user
                  ? `Sign In & Join ${selectedMonth} Group`
                  : `Pay ₹${membershipFee} & Join ${selectedMonth} Group`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
