import React from 'react';
import { GroupStatus } from '@/types';
import { Users, Clock, CheckCircle2, ShieldAlert, Sparkles, RefreshCcw } from 'lucide-react';

interface StatusBadgeProps {
  status: GroupStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Building':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: Users,
          label: 'BUILDING GROUP',
        };
      case 'Almost Full':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          icon: Clock,
          label: 'ALMOST FULL',
        };
      case 'Negotiation Ready':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: Sparkles,
          label: 'NEGOTIATION READY',
        };
      case 'Negotiating':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500 animate-pulse',
          icon: Clock,
          label: 'NEGOTIATING WITH DEALERS',
        };
      case 'Offer Received':
        return {
          bg: 'bg-emerald-600 text-white border-emerald-700',
          dot: 'bg-white',
          icon: CheckCircle2,
          label: 'OFFER RECEIVED',
        };
      case 'Purchase Window Open':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
          icon: CheckCircle2,
          label: 'PURCHASE WINDOW OPEN',
        };
      case 'Completed':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          icon: CheckCircle2,
          label: 'GROUP COMPLETED',
        };
      case 'Refund Processing':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          icon: RefreshCcw,
          label: 'REFUND PROCESSING',
        };
      case 'Refunded':
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          icon: CheckCircle2,
          label: 'FEE REFUNDED',
        };
      case 'Failed':
      default:
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-400',
          icon: ShieldAlert,
          label: 'GROUP CLOSED',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase ${config.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
