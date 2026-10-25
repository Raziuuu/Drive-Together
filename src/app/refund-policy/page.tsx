import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RefreshCcw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Official Platform Guarantee
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            3-Month Group Membership Fee Refund Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last revised: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 text-sm text-slate-700 leading-relaxed shadow-sm">
          {/* Important alert */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <strong className="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Core Principle: 100% Risk-Free Participation</span>
            </strong>
            <p>
              DriveTogether charges a nominal Group Membership Fee (₹199 – ₹499) to verify that members in our groups are serious buyers. If DriveTogether cannot aggregate the minimum required number of buyers within the designated 3-month window, 100% of this fee is refunded.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Nature of the Group Membership Fee</h2>
            <p>
              The Group Membership Fee is a one-time platform fee required to enter and participate in an active vehicle group. It is NOT a vehicle booking deposit, advance payment, or part payment toward the purchase price of the vehicle.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. The 3-Month Group Cycle System</h2>
            <p>
              Vehicle buyer groups operate in standard 30-day monthly cycles:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li>
                <strong>Month 1:</strong> If the minimum member threshold is reached, dealership negotiation begins immediately. If the minimum is not reached, members are automatically rolled over to Month 2 without paying any additional fee.
              </li>
              <li>
                <strong>Month 2:</strong> Additional members join the group. If the threshold is reached, negotiation starts. If not, members roll over to Month 3.
              </li>
              <li>
                <strong>Month 3:</strong> Final aggregation cycle. If the threshold is achieved, the group is marked Negotiation Ready. If the threshold is still not achieved at the conclusion of Month 3, the group closes and automatic refunds are triggered.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Automatic Refund Trigger</h2>
            <p>
              If a vehicle group fails to meet its minimum required buyer count after the conclusion of 3 consecutive monthly cycles, the platform initiates an automated 100% refund of the Group Membership Fee.
            </p>
            <p className="text-xs text-slate-500">
              Refunds are credited directly back to the original payment source (UPI account, debit/credit card, or net banking) within 3 to 5 banking business days.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Group Membership Exclusivity</h2>
            <p>
              Each membership fee is tied to the specific vehicle model and regional group joined. Memberships cannot be transferred or credited to another model because dealerships commit commercial discounts based on model-specific volume commitments.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Assistance and Disputes</h2>
            <p>
              For any questions regarding your refund status or active cycle tracking, contact our customer support desk at <strong>support@drivetogether.in</strong> or phone <strong>+91 824 298 0044</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
