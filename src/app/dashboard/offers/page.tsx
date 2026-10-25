'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { dealerService, groupService } from '@/services';
import { DealerOffer, Group } from '@/types';
import { Tag, Building2, Sparkles, CheckCircle2, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function DashboardOffersPage() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<DealerOffer[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      setIsLoading(true);
      try {
        const [oList, gList] = await Promise.all([
          dealerService.getOffers(),
          groupService.getGroups(),
        ]);
        setOffers(oList);
        setGroups(gList);
      } catch (err) {
        console.error('Failed to load user offers', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Negotiated Pricing</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Dealer Offers & Vouchers</h1>
        <p className="text-xs text-slate-500 mt-1">
          Exclusive institutional bulk discounts obtained from authorized dealerships for groups that reached threshold.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      ) : offers.length > 0 ? (
        <div className="space-y-6">
          {offers.map((offer) => {
            const group = groups.find((g) => g.id === offer.group_id);
            const vehicle = group?.vehicle;
            const dealer = offer.dealer;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border-2 border-emerald-600/30 overflow-hidden shadow-sm hover:shadow-md transition p-6 sm:p-7 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{dealer?.business_name}</h3>
                      <p className="text-xs text-slate-500">{dealer?.address}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
                    Verified Dealership Offer
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    {vehicle?.image_url && (
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                        <Image src={vehicle.image_url} alt={vehicle.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase">{vehicle?.brand?.name}</span>
                      <h4 className="text-lg font-bold text-slate-900">{vehicle?.name}</h4>
                      <p className="text-xs text-slate-500">Group Location: {group?.location}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left md:text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                      Guaranteed Group Discount
                    </span>
                    <span className="text-2xl font-black text-emerald-900">
                      ₹{offer.discount_amount.toLocaleString('en-IN')} OFF
                    </span>
                    <span className="text-xs text-slate-700 block">
                      Negotiated Net Price: ₹{offer.offer_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {offer.notes && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">Negotiated Terms:</strong>
                    {offer.notes}
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Offer expires on {new Date(offer.offer_expiry).toLocaleDateString('en-IN')}</span>
                  </span>

                  <a
                    href={`tel:${dealer?.phone}`}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2 rounded-xl transition text-xs shadow-sm"
                  >
                    <span>Contact Dealership Coordinator ({dealer?.contact_name})</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Tag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No active dealer offers ready yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once your vehicle group reaches the minimum required buyer threshold, dealership offers will be posted here.
          </p>
        </div>
      )}
    </div>
  );
}
