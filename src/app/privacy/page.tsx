import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">Last revised: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed shadow-sm">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p className="text-xs text-slate-600">
              We collect your phone number for secure OTP authentication, your name, preferred delivery location, and preferred vehicle variant when joining a buyer group.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. How We Use Information</h2>
            <p className="text-xs text-slate-600">
              Your contact details are used solely to communicate group progress, cycle advancements, and dealer offers. Your personal contact number is never sold or handed over to multiple random telemarketing agencies. Only authorized dealership corporate coordinators of groups you joined receive verified voucher redemption details.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Data Security & Encryption</h2>
            <p className="text-xs text-slate-600">
              All transactions and membership records are encrypted using industry-standard protocols with strict Row-Level Security in our database architecture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
