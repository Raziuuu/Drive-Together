'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Tag,
  CreditCard,
  RefreshCcw,
  Bell,
  User,
  LogOut,
  CarFront,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, unreadNotificationCount, setLoginModalOpen } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Groups', href: '/dashboard/groups', icon: Users },
    { label: 'Dealer Offers', href: '/dashboard/offers', icon: Tag },
    { label: 'Payment Records', href: '/dashboard/payments', icon: CreditCard },
    { label: 'Refund Guarantee', href: '/dashboard/refunds', icon: RefreshCcw },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: unreadNotificationCount },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md w-full space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Sign in to view your dashboard</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Access your active vehicle buyer memberships, track negotiation progress, and review dealership offers.
          </p>
          <div className="space-y-2 pt-2">
            <Link
              href="/login?redirect=/dashboard"
              className="w-full inline-flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl transition text-sm shadow-sm"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/signup"
              className="w-full inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition text-sm"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dashboard Sidebar (3 cols) */}
          <aside className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-6">
            {/* User Mini Profile */}
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {user.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user.full_name}</h3>
                <p className="text-xs text-slate-500 truncate">{user.phone_number}</p>
                <span className="inline-block text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                  Verified Buyer
                </span>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          active ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Dashboard Content Area (9 cols) */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </div>
    </div>
  );
}
