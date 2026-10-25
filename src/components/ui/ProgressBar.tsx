import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  size = 'md',
  showLabel = false,
}) => {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const getBarColor = () => {
    if (percentage >= 100) return 'bg-emerald-600';
    if (percentage >= 75) return 'bg-emerald-500';
    if (percentage >= 40) return 'bg-teal-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${getBarColor()} h-full rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-500 mt-1.5">
          <span>{percentage}% completed</span>
          <span>{Math.max(0, total - current)} needed</span>
        </div>
      )}
    </div>
  );
};
