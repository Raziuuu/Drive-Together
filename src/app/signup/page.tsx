'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_OTP } from '@/services/authService';
import {
  User,
  Phone,
  MapPin,
  CarFront,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BadgePercent,
  Lock,
} from 'lucide-react';

const CITIES = ['Mangalore', 'Puttur', 'BC Road', 'Uppinangady'];
const INTERESTS = ['Cars', 'Motorcycles', 'Electric Scooters', 'Auto / 3-Wheelers'];

function SignupContent() {
  const router = useRouter();
  const { user, sendOtp, verifyOtp, updateProfile } = useAuth();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Mangalore');
  const [area, setArea] = useState('');
  const [interest, setInterest] = useState('Cars');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanDigits = phoneNumber.replace(/\D/g, '');
    if (cleanDigits.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendOtp(phoneNumber);
      setStep('otp');
      setResendCountdown(30);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyAndRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(phoneNumber, enteredOtp);
      // Update profile with name and city
      await updateProfile({
        full_name: fullName.trim(),
        city,
        area: area.trim() || city,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition">
            <CarFront className="w-7 h-7 stroke-[2.2]" />
          </div>
        </Link>
        <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          Join Drive<span className="text-emerald-700">Together</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Create an account to join verified buyer groups and save thousands on your next vehicle.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <Link
              href="/login"
              className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white text-slate-900 shadow-sm"
            >
              Create Account
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition overflow-hidden bg-slate-50">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahammad Razi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 text-slate-900 text-sm font-medium bg-transparent outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                  <User className="w-4 h-4 text-slate-400 mr-3.5 shrink-0" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition overflow-hidden bg-slate-50">
                  <div className="px-3.5 py-3 bg-slate-100 border-r border-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-1.5 select-none">
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    required
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 text-slate-900 text-sm font-medium bg-transparent outline-none placeholder:text-slate-400"
                  />
                  <Phone className="w-4 h-4 text-slate-400 mr-3.5 shrink-0" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Used for verified buyer groups and dealership vouchers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    City / Town
                  </label>
                  <div className="relative">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Area / Locality (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kadri, Darbe, etc."
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Primary Interest
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setInterest(item)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition ${
                        interest === item
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || phoneNumber.replace(/\D/g, '').length !== 10 || !fullName.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
                >
                  {isSubmitting ? (
                    <span>Sending Code...</span>
                  ) : (
                    <>
                      <span>Continue & Verify Mobile</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-500">Enter verification code sent to:</span>
                <p className="font-bold text-slate-900 text-sm">+91 {phoneNumber}</p>
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Edit details</span>
                </button>
              </div>

              <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      otpInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 text-center text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition"
                  />
                ))}
              </div>

              {/* Demo Hint Banner */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-0.5">
                <span className="text-[11px] font-bold text-emerald-800 block">
                  Demo Verification Code
                </span>
                <span className="text-xs text-emerald-900 font-semibold font-mono tracking-widest">
                  {DEMO_OTP}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
              >
                {isSubmitting ? <span>Creating Account...</span> : <span>Complete Registration</span>}
              </button>

              <div className="text-center">
                {resendCountdown > 0 ? (
                  <span className="text-xs text-slate-400">
                    Resend code in <strong className="text-slate-600">{resendCountdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sendOtp(phoneNumber);
                      setResendCountdown(30);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Already have an account? Sign In */}
          <div className="mt-6 text-center text-xs text-slate-500 pt-6 border-t border-slate-200">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Benefits bar */}
        <div className="mt-6 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Why Join DriveTogether?</span>
          </div>
          <ul className="space-y-1 text-slate-600 pl-6 list-disc">
            <li>Combine purchasing power with serious buyers in Coastal Karnataka</li>
            <li>100% Refundable Group Membership Fee if target discount isn’t reached</li>
            <li>Direct voucher redemption at authorized dealerships</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading registration...</div>}>
      <SignupContent />
    </Suspense>
  );
}
