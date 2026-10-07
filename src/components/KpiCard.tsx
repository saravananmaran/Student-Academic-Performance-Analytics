import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan';
  badge?: {
    text: string;
    variant: 'positive' | 'negative' | 'neutral' | 'warning';
  };
  onClick?: () => void;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/50',
    glow: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-900/50',
    glow: 'hover:border-indigo-300 dark:hover:border-indigo-700',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/50',
    glow: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/50',
    glow: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-100 dark:border-rose-900/50',
    glow: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-900/50',
    glow: 'hover:border-purple-300 dark:hover:border-purple-700',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-100 dark:border-cyan-900/50',
    glow: 'hover:border-cyan-300 dark:hover:border-cyan-700',
  },
};

const badgeStyles = {
  positive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  negative: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  neutral: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  onClick,
}) => {
  const currentStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 ${
        currentStyle.glow
      } hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${currentStyle.bg} border ${currentStyle.border}`}>
          <Icon className={`w-5 h-5 ${currentStyle.iconColor}`} />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </span>
          )}
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full font-semibold border ${
                badgeStyles[badge.variant]
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
