'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_OTP } from '@/services/authService';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CarFront,
  CheckCircle2,
  Lock,
  Sparkles,
  Shield,
  UserCheck,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const { user, sendOtp, verifyOtp, loginAsDemo } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
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
      router.push(redirectUrl);
    }
  }, [user, redirectUrl, router]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      setError(err?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOtp(phoneNumber, enteredOtp);
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err?.message || 'Invalid verification code. Please check and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    loginAsDemo(role);
    router.push(role === 'admin' ? '/admin' : redirectUrl);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition">
            <CarFront className="w-7 h-7 stroke-[2.2]" />
          </div>
        </Link>
        <h1 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          Welcome to Drive<span className="text-emerald-700">Together</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your mobile number to access your vehicle buyer groups and offers.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200">
            <Link
              href="/login"
              className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-white text-slate-900 shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="flex-1 py-2 text-center text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-900 transition"
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

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
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
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 text-slate-900 text-sm font-medium bg-transparent outline-none placeholder:text-slate-400"
                    autoFocus
                  />
                  <Phone className="w-4 h-4 text-slate-400 mr-3.5 shrink-0" />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
                  We will send a 6-digit verification code to this number.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.replace(/\D/g, '').length !== 10}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
              >
                {isSubmitting ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-500">Code sent to:</span>
                <p className="font-bold text-slate-900 text-sm">+91 {phoneNumber}</p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-[11px] text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change number</span>
                </button>
              </div>

              {/* 6-box OTP inputs */}
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
                {isSubmitting ? <span>Verifying...</span> : <span>Verify & Continue</span>}
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

          {/* Quick Login Shortcuts */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              One-Click Quick Access
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition"
              >
                <Shield className="w-3.5 h-3.5 text-purple-700" />
                <span>Admin Login</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('user')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Buyer Login</span>
              </button>
            </div>
          </div>

          {/* New to DriveTogether? Register */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Don’t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Security / Trust guarantees */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>100% Refund Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure OTP Sign-In</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-400">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
