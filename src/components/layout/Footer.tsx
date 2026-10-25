import React from 'react';
import Link from 'next/link';
import { CarFront, ShieldCheck, RefreshCcw, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <CarFront className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Drive<span className="text-emerald-400">Together</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The premier vehicle group-buying platform. We aggregate serious buyers, pool purchasing demand, and negotiate genuine group discounts with verified regional dealerships.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Dealerships</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCcw className="w-4 h-4 text-emerald-400" />
                <span>3-Month Refund Guarantee</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/vehicles" className="hover:text-emerald-400 transition">
                  Explore Vehicles
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition">
                  How Group Buying Works
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-emerald-400 transition">
                  Dealer Offers
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-emerald-400 transition">
                  Active Locations
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition">
                  Buyer Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Target Locations */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Initial Focus Areas</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mangalore Hub</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Puttur</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>BC Road (Bantwal)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Uppinangady</span>
              </li>
              <li className="text-xs text-slate-500 pt-1">Expanding across Karnataka soon</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Assistance</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 824 298 0044</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@drivetogether.in</span>
              </p>
              <p className="text-xs text-slate-500 pt-2">
                Operating Hours: 9:30 AM – 6:30 PM (Mon–Sat)
              </p>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency & Legal Disclaimers (as emphasized in Section 42 & 43) */}
        <div className="pt-8 pb-8 border-b border-slate-800 text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-300">Important Disclaimer:</strong> Group Membership Fee is a one-time fee to participate in the selected vehicle group. It is NOT a vehicle booking amount, advance payment, or part payment toward the vehicle purchase price. The fee ensures groups consist only of serious, verified buyers so our team can negotiate authentic institutional fleet pricing from authorized dealerships.
          </p>
          <p>
            <strong className="text-slate-300">Final Pricing:</strong> Final on-road vehicle pricing depends on the negotiated authorized dealer offer, applicable state taxes, RTO registration, insurance coverage, financing rates, and dealer-level inventory availability. Group discounts are subject to dealer participation.
          </p>
          <p>
            <strong className="text-slate-300">3-Month Membership Protection:</strong> If a vehicle group does not reach the required minimum buyer count after the complete 3-month cycle duration, the Group Membership Fee is automatically queued for 100% refund in accordance with our transparent refund policy.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DriveTogether Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-slate-300">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
