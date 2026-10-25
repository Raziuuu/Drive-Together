'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  CarFront,
  MapPin,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Shield,
} from 'lucide-react';

const LOCATIONS = [
  'All Locations',
  'Mangalore',
  'Puttur',
  'BC Road',
  'Uppinangady',
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    setLoginModalOpen,
    logout,
    loginAsDemo,
    selectedLocation,
    setSelectedLocation,
    unreadNotificationCount,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userDropdownRef = React.useRef<HTMLDivElement>(null);
  const locationDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: 'Explore Vehicles', href: '/vehicles' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Dealer Offers', href: '/offers' },
    { label: 'Locations', href: '/locations' },
    { label: 'Admin Console', href: '/admin' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm transition group-hover:bg-emerald-800">
              <CarFront className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition">
                Drive<span className="text-emerald-700">Together</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-400 -mt-1">
                Buy Together. Save More.
              </span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="relative hidden lg:block" ref={locationDropdownRef}>
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Delivery Hub
                </div>
                {LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition flex items-center justify-between ${
                      selectedLocation === loc
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{loc}</span>
                    {selectedLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive(link.href)
                  ? 'text-emerald-700 bg-emerald-50/70 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* TOP-RIGHT CORNER: USER PROFILE & ACTIONS (DESKTOP & MOBILE) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 relative" ref={userDropdownRef}>
              {/* Notifications Bell */}
              <Link
                href="/dashboard/notifications"
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
                )}
              </Link>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-800 transition shadow-sm"
                  aria-label="User Profile Menu"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {getInitials(user.full_name)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="max-w-[130px] truncate font-semibold text-xs text-slate-900 leading-tight">
                      {user.full_name || 'My Account'}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium capitalize">
                      {user.role === 'admin' ? 'Platform Admin' : 'Verified Buyer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* User Profile Card Header */}
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                        {getInitials(user.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{user.phone_number}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold capitalize">
                            {user.role}
                          </span>
                          <span className="text-[10px] text-slate-400">• {user.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <User className="w-4 h-4 text-emerald-700" />
                        <span>My Profile & Settings</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                        <span>Buyer Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/groups"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>My Joined Groups</span>
                      </Link>

                      <Link
                        href="/dashboard/payments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-800 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Payment Records & Invoices</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 transition"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Admin Management Console</span>
                        </Link>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3.5 sm:px-4 py-2 rounded-xl transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Location in mobile */}
          <div className="pt-1 pb-2 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Location:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border text-left transition ${
                    selectedLocation === loc
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-medium'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>Buyer Dashboard</span>
                  {unreadNotificationCount > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50"
                  >
                    Admin Console
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-medium text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50"
              >
                Sign Out ({user.full_name})
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-slate-800 border border-slate-300 rounded-xl hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 shadow-sm transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
