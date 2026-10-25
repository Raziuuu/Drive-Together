import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
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

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last revised: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Nature of Platform</h2>
            <p className="text-xs text-slate-600">
              DriveTogether is a vehicle buyer group-aggregation platform. DriveTogether is NOT a motor vehicle dealer, broker, or financial lender. DriveTogether connects prospective purchasers together to negotiate collective volume deals directly with authorized brand dealerships.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Dealership Relationship & Vehicle Invoicing</h2>
            <p className="text-xs text-slate-600">
              All vehicle purchase contracts, warranties, registrations, financing, and deliveries are executed directly between you (the customer) and the authorized manufacturer dealership. DriveTogether does not accept or hold vehicle purchase deposits.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Group Membership Fee</h2>
            <p className="text-xs text-slate-600">
              The Group Membership Fee is a non-booking entry fee to join and participate in an active vehicle group. It covers market aggregation, dealer auditing, and corporate negotiation. If the group does not reach threshold after 3 monthly cycles, this fee is refunded under our 3-Month Protection Guarantee.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Final Pricing & Availability</h2>
            <p className="text-xs text-slate-600">
              Discounts, expected savings, and delivery timelines are subject to dealer stock availability, manufacturer price revisions, and statutory taxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
