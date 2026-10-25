'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  Users,
  CarFront,
  Building2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loginAsDemo } = useAuth();

  const navItems = [
    { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Group Operations & Cycles', href: '/admin/groups', icon: Users },
    { label: 'Vehicle Catalog & Categories', href: '/admin/vehicles', icon: CarFront },
    { label: 'Dealerships & Offers', href: '/admin/dealers', icon: Building2 },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  // If user is not admin, provide a quick one-click switch for demo reviewers
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-900/50 text-purple-400 flex items-center justify-center mx-auto border border-purple-700/50">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">Admin Console Protection</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are currently signed in as a regular Buyer. In development demo mode, you can instantly switch into the Administrator role to test group cycle promotions, refund triggers, and dealership offer management.
          </p>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => loginAsDemo('admin')}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition text-xs shadow-md"
            >
              Switch to Admin Role (Demo One-Click)
            </button>
            <Link
              href="/"
              className="w-full inline-block text-xs text-slate-400 hover:text-white py-2"
            >
              Return to Public Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 p-5 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">DriveTogether Admin Console</h1>
                <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as {user.full_name} ({user.phone_number})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAsDemo('user')}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
            >
              Switch to Buyer View
            </button>
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1"
            >
              <span>Live Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  active
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Admin Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
