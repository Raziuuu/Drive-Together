'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services';
import { Payment } from '@/types';
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await paymentService.getPaymentsByUser(user.id);
        setPayments(list);
      } catch (err) {
        console.error('Failed to load payments', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Financial Records</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Payment History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete ledger of one-time Group Membership Fees paid for vehicle group participation.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Transaction Ref</th>
                  <th className="py-4 px-6">Vehicle Group</th>
                  <th className="py-4 px-6">Fee Amount</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const group = p.group;
                  const vehicle = group?.vehicle;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-mono font-semibold text-slate-900">
                        {p.transaction_reference}
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 block">{vehicle?.name || 'Vehicle Group'}</span>
                        <span className="text-slate-400 text-[11px]">{group?.location}</span>
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-900">
                        ₹{p.amount.toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 block font-normal">Group Entry Fee</span>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        {new Date(p.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            p.payment_status === 'successful'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : p.payment_status === 'refund_pending'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{p.payment_status.replace('_', ' ')}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => alert(`Official Receipt for ${p.transaction_reference}\nAmount: ₹${p.amount}\nStatus: Verified\nPlatform: DriveTogether`)}
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Payments are backed by the 3-Month Membership Fee Refund Guarantee.</span>
            </span>
            <Link href="/refund-policy" className="font-semibold text-slate-700 hover:underline">
              Read Policy →
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No payment records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Payment records will appear here after you join your first vehicle buyer group.
          </p>
        </div>
      )}
    </div>
  );
}
