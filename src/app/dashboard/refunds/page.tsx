'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { refundService } from '@/services';
import { Refund } from '@/types';
import { RefreshCcw, ShieldCheck, CheckCircle2, Clock, AlertCircle, HelpCircle } from 'lucide-react';

export default function RefundsPage() {
  const { user } = useAuth();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRefunds() {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await refundService.getRefundsByUser(user.id);
        setRefunds(list);
      } catch (err) {
        console.error('Failed to load refunds', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRefunds();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Buyer Protection</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
          3-Month Refund Guarantee
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          If a group does not reach its minimum required buyers after 3 full monthly cycles, the Group Membership Fee is 100% refunded.
        </p>
      </div>

      {/* Refund Mechanism Summary Card */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">100% Risk-Free Guarantee Policy</h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Zero penalty, zero cancellation charges if the platform cannot form a viable negotiation group.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-emerald-100">
          <div className="p-3.5 rounded-xl bg-emerald-800/60 border border-emerald-700/60 space-y-1">
            <span className="font-bold text-white block">Full 3 Months Protection</span>
            <p className="text-[11px] text-emerald-200">
              Members are given up to 3 monthly cycles to achieve threshold demand before a group closes.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-800/60 border border-emerald-700/60 space-y-1">
            <span className="font-bold text-white block">Automatic System Trigger</span>
            <p className="text-[11px] text-emerald-200">
              You do not need to follow up or plead for refunds. Unreached groups trigger automatic refunds.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-800/60 border border-emerald-700/60 space-y-1">
            <span className="font-bold text-white block">Original Payment Source</span>
            <p className="text-[11px] text-emerald-200">
              Funds are credited back to UPI, card, or net banking account within 3–5 banking business days.
            </p>
          </div>
        </div>
      </div>

      {/* Active Refund Records */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900">Your Refund Ledger</h3>

        {isLoading ? (
          <div className="h-40 bg-slate-200 rounded-3xl animate-pulse" />
        ) : refunds.length > 0 ? (
          <div className="space-y-4">
            {refunds.map((ref) => {
              const group = ref.group;
              const vehicle = group?.vehicle;

              return (
                <div
                  key={ref.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm"
                >
                  {/* Status Banner as per Section 28 */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-700" />
                        <span>Group Didn't Reach the Required Size</span>
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          ref.status === 'refunded'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {ref.status === 'refunded' ? 'REFUNDED' : 'PROCESSING'}
                      </span>
                    </div>
                    <p className="text-amber-800/90 leading-relaxed pt-1">
                      We couldn't reach the minimum number of serious buyers required to negotiate a group offer within the 3-month membership period.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Vehicle</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {vehicle?.name || 'Honda Shine 125'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Refund Amount</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        ₹{ref.amount} (100% Refund)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Refund Status</span>
                      <span className="font-bold text-slate-800 text-sm capitalize">
                        {ref.status}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Initiated Date</span>
                      <span className="font-bold text-slate-800 text-sm">
                        {new Date(ref.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
                    <span>Refund Reason: {ref.reason}</span>
                    <span className="font-mono text-slate-400">Ref: {ref.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No refunds active</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All your active vehicle groups are currently building or progressing through active monthly cycles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
