'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_OTP } from '@/services/authService';
import { X, Phone, ShieldCheck, ArrowRight, ArrowLeft, CarFront, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const {
    loginModalOpen,
    setLoginModalOpen,
    postLoginRedirect,
    setPostLoginRedirect,
    sendOtp,
    verifyOtp,
  } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
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

  if (!loginModalOpen) return null;

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

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const split = pasted.split('');
      setOtp(split);
      otpInputRefs.current[5]?.focus();
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
      setStep('success');

      setTimeout(() => {
        setLoginModalOpen(false);
        setStep('phone');
        setOtp(['', '', '', '', '', '']);
        setPhoneNumber('');

        if (postLoginRedirect) {
          router.push(postLoginRedirect);
          setPostLoginRedirect(null);
        }
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Invalid OTP. In demo mode, enter 123456');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillDemo = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            setLoginModalOpen(false);
            setStep('phone');
            setError(null);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <CarFront className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">DriveTogether</h3>
              <p className="text-xs text-slate-500 font-medium">Buy Together. Save More.</p>
            </div>
          </div>

          {step === 'phone' && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Sign In with Mobile
              </h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">
                Enter your mobile number to view active groups, joined vehicle memberships, and negotiate group deals.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition">
                    <span className="inline-flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-sm font-medium text-slate-600">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={10}
                      required
                      autoFocus
                      className="w-full px-3.5 py-3 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition shadow-sm"
                >
                  <span>{isSubmitting ? 'Sending OTP...' : 'Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Dev Note */}
              <div className="mt-5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Development Demo Mode:</span> No real SMS provider required. Use any 10-digit number and enter demo OTP <strong className="font-mono">123456</strong> on the next step.
                </div>
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-4 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change mobile number</span>
              </button>

              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Verify 6-Digit OTP
              </h2>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Enter the 6-digit code sent to{' '}
                <strong className="text-slate-800">+91 {phoneNumber}</strong>
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              {/* 6 Box OTP Inputs */}
              <div className="flex justify-between gap-2 mb-6" onPaste={handleOtpPaste}>
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
                    className="w-12 h-13 text-center text-lg font-bold text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition shadow-sm mb-4"
              >
                <span>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Didn't receive the code?</span>
                {resendCountdown > 0 ? (
                  <span className="text-slate-400">Resend in {resendCountdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setResendCountdown(30);
                      sendOtp(phoneNumber);
                    }}
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Demo Mode Helper */}
              <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                <div>
                  <span className="font-semibold">Demo OTP:</span>{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-bold text-emerald-800">
                    {DEMO_OTP}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="text-xs bg-emerald-700 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-800 font-medium transition"
                >
                  Autofill 123456
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Welcome to DriveTogether!</h3>
              <p className="text-xs text-slate-500">Authentication successful. Entering platform...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
