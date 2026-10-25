'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services';
import { Notification } from '@/types';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Users,
  RefreshCcw,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react';

export default function NotificationsPage() {
  const { user, refreshUserData } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      if (!user) return;
      setIsLoading(true);
      try {
        const list = await notificationService.getNotifications(user.id);
        setNotifications(list);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifs();
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    refreshUserData();
  };

  const getNotifIcon = (type: Notification['type']) => {
    switch (type) {
      case 'offer_received':
        return <Sparkles className="w-5 h-5 text-emerald-700" />;
      case 'group_progress':
      case 'group_joined':
        return <Users className="w-5 h-5 text-emerald-700" />;
      case 'refund_initiated':
      case 'refund_completed':
        return <RefreshCcw className="w-5 h-5 text-emerald-700" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Updates</span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Notifications</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time updates regarding group thresholds, dealer negotiations, monthly cycle rollovers, and refunds.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 sm:p-6 transition flex items-start justify-between gap-4 ${
                n.read ? 'bg-white' : 'bg-emerald-50/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    n.read ? 'bg-slate-100' : 'bg-emerald-100'
                  }`}
                >
                  {getNotifIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition text-xs flex items-center gap-1"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">Mark read</span>
                  </button>
                )}

                {n.link_url && (
                  <Link
                    href={n.link_url}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You will receive updates here as groups make progress and dealership negotiations progress.
          </p>
        </div>
      )}
    </div>
  );
}
