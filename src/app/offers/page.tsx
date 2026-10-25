'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dealerService, groupService } from '@/services';
import { DealerOffer, Group } from '@/types';
import {
  Tag,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function OffersPage() {
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
        console.error('Failed to load offers', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOffers();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Dealership Offers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Active Negotiated Group Deals
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            These exclusive group discounts have been negotiated directly with authorized regional dealerships for groups that reached threshold.
          </p>
        </div>

        {/* Offers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offers.map((offer) => {
              const group = groups.find((g) => g.id === offer.group_id);
              const vehicle = group?.vehicle;
              const dealer = offer.dealer;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-7 space-y-5">
                    {/* Top Dealership Badge */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold text-slate-900">
                          {dealer?.business_name || 'Authorized Dealership'}
                        </span>
                        {dealer?.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dealer?.city}</span>
                      </span>
                    </div>

                    {/* Vehicle & Discount Section */}
                    <div className="flex items-center gap-5">
                      {vehicle?.image_url && (
                        <div className="relative w-28 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <Image
                            src={vehicle.image_url}
                            alt={vehicle.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 space-y-1">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          {vehicle?.brand?.name}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{vehicle?.name}</h3>
                        <p className="text-xs text-slate-500">
                          Group Size:{' '}
                          <strong className="text-slate-800">
                            {group?.current_members} buyers
                          </strong>{' '}
                          ({group?.location})
                        </p>
                      </div>
                    </div>

                    {/* Savings highlight box */}
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                          Negotiated Group Discount
                        </span>
                        <span className="text-2xl font-black text-emerald-900">
                          ₹{offer.discount_amount.toLocaleString('en-IN')} OFF
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Exclusive Group Price</span>
                        <span className="text-sm font-bold text-slate-900">
                          ₹{offer.offer_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    {offer.notes && (
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                        {offer.notes}
                      </p>
                    )}

                    {/* Expiry */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>
                          Valid until{' '}
                          {new Date(offer.offer_expiry).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Active Group Deal
                      </span>
                    </div>
                  </div>

                  {/* CTA bar */}
                  <div className="p-4 sm:px-7 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Showroom location: {dealer?.address}
                    </span>
                    {vehicle && (
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>View Group Status</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Tag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No public offers listed currently</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Negotiated dealer offers are posted once active vehicle buyer groups reach threshold.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
