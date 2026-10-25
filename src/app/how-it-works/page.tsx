'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  Users,
  Building2,
  CheckCircle2,
  RefreshCcw,
  Clock,
  ArrowRight,
  HelpCircle,
  FileText,
  BadgeAlert,
} from 'lucide-react';

export default function HowItWorksPage() {
  const faqs = [
    {
      q: 'Why do you charge a Group Membership Fee?',
      a: 'Dealerships reject online interest requests because 95% of people who click "Interested" never actually buy. By charging a nominal Group Membership Fee (₹199 to ₹499), we guarantee that every member in the group is a serious, genuine buyer. This gives us immense bargaining power to negotiate institutional fleet rates on your behalf.',
    },
    {
      q: 'Is the Group Membership Fee deducted from the vehicle price?',
      a: 'No. The Group Membership Fee is not a vehicle booking amount, advance payment, or deposit toward the vehicle. It is a separate platform participation fee that covers group aggregation, dealer auditing, and volume price negotiation.',
    },
    {
      q: 'How does the 3-Month Protection Guarantee work?',
      a: 'Groups operate in 30-day cycles. If a group has not yet reached its minimum required buyers at the end of Month 1, members automatically roll over into Month 2 and Month 3 at no additional charge. If the minimum threshold is still not achieved after 3 full months, 100% of your Group Membership Fee is refunded to your original payment method.',
    },
    {
      q: 'Who do I actually purchase the vehicle from?',
      a: 'You purchase the vehicle directly from authorized regional brand dealerships (in Mangalore, Puttur, or BC Road). The dealership issues the official invoice in your name, provides the standard manufacturer warranty, handles RTO registration, and delivers the vehicle to you.',
    },
    {
      q: 'Can I transfer my membership fee to another vehicle?',
      a: 'No. Each group membership is dedicated to the vehicle and regional cluster you joined. Because dealerships commit pricing based on specific model demand, memberships cannot be switched between different models.',
    },
    {
      q: 'Am I obligated to buy the vehicle once an offer is received?',
      a: 'No. Once we present the negotiated dealership offer, you review the complete breakdown (discounts, insurance options, accessories). If you choose to proceed, you finalize the booking directly with the showroom. If you choose not to proceed, there is no penalty.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Platform Mechanism
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How DriveTogether Works
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            DriveTogether brings serious vehicle buyers together, combines collective purchasing volume, and negotiates fleet pricing from authorized regional dealerships.
          </p>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>The 5-Step Group-Buying Journey</span>
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                01
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">01 — Find Your Vehicle</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse our catalog of cars, motorcycles, scooters, and 3-wheelers across Mangalore, Puttur, BC Road, and Uppinangady. Review technical specifications, variant pricing, and live buyer counts.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                02
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">02 — Join a Group & Pay Membership Fee</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pay a small, transparent Group Membership Fee (₹199 for scooters, ₹299 for bikes, ₹399 for autos, ₹499 for cars). This one-time fee filters out casual window shoppers and verifies you as a genuine buyer with high intent.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                03
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">03 — Build the Group (3-Month Carry Forward)</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As regional buyers join, progress ticks up. If a group reaches its target within 30 days, negotiation begins immediately. If not, members automatically carry forward into the next monthly cycle for up to 3 months.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                04
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">04 — Professional Dealership Negotiation</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Once the group reaches threshold (typically 30–50 buyers), our corporate trade desk approaches authorized regional brand dealerships. We present guaranteed bulk demand to secure maximum cash discounts, accessory packages, and priority delivery slots.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-start gap-5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shrink-0">
                05
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-base font-bold text-slate-900">05 — Receive Deal & Purchase with Confidence</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You receive the official negotiated dealership offer in your dashboard. You take your verified group voucher directly to the authorized showroom to complete your vehicle purchase with the exclusive group savings applied!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed 3-Month Cycle Diagram */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <RefreshCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                The 3-Month Group Cycle & Refund System
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Here is exactly what happens each month after you join a group:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Month 1</span>
                <span className="text-emerald-700">Initial Cycle</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Group launches (e.g. 25 buyers join, minimum required is 50). Threshold not reached yet.
              </p>
              <div className="text-[11px] font-semibold text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                → All 25 members automatically carried forward to Month 2.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Month 2</span>
                <span className="text-emerald-700">Expansion Cycle</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Existing members + new buyers join. If 50 reached, negotiation begins immediately! If still below 50:
              </p>
              <div className="text-[11px] font-semibold text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                → Carried forward to final Month 3 cycle.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Month 3</span>
                <span className="text-emerald-800">Final Cycle & Guarantee</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                If 50 buyers reached: Dealership negotiation commences. If minimum still not reached after 3 full months:
              </p>
              <div className="text-[11px] font-bold text-emerald-900 bg-white p-2 rounded-lg border border-emerald-300">
                → 100% Membership Fee refunded automatically!
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-700" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2"
              >
                <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <h3 className="text-2xl font-bold">Ready to see active vehicle groups?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Explore cars, bikes, scooters and autos in Mangalore, Puttur, BC Road & Uppinangady.
          </p>
          <div className="pt-2">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition shadow-md"
            >
              <span>Explore Vehicle Groups</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
