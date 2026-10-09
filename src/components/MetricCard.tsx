import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  category?: 'Exact Protocol' | 'Derived Metric' | 'Simulation' | 'DAMM v2';
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subValue,
  category,
  highlight,
}) => {
  const getBadgeStyle = () => {
    switch (category) {
      case 'Exact Protocol':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Derived Metric':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Simulation':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'DAMM v2':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      className={`glass-panel p-4 rounded-xl transition-all duration-200 border ${
        highlight
          ? 'border-orange-500/40 bg-slate-900/90 glow-orange'
          : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {category && (
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${getBadgeStyle()}`}>
            {category}
          </span>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5">
        <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-mono">{unit}</span>}
      </div>

      {subValue && (
        <p className="mt-1 text-[11px] text-slate-400 leading-tight">
          {subValue}
        </p>
      )}
    </div>
  );
};
