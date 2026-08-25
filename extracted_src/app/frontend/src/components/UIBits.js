import React from 'react';
import { statusColor, riskColor } from '../simulation/riskEngine';
import { CheckCircle2, AlertTriangle, AlertOctagon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const Panel = ({ children, className = '', ...rest }) => (
  <div className={`bg-[#121418] border border-white/10 rounded-sm ${className}`} {...rest}>{children}</div>
);

export const SectionLabel = ({ children, className = '' }) => (
  <div className={`text-xs uppercase tracking-[0.18em] text-zinc-500 ${className}`}>{children}</div>
);

export const StatusPill = ({ status }) => {
  const c = statusColor(status);
  const Icon = status === 'critical' ? AlertOctagon : status === 'warning' ? AlertTriangle : CheckCircle2;
  return (
    <span data-testid={`status-pill-${status}`} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[11px] font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <Icon size={12} strokeWidth={1.8} />{c.label}
    </span>
  );
};

export const RiskBadge = ({ category, score }) => {
  const c = riskColor(category);
  return (
    <span data-testid="risk-badge" className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border ${c.bg} ${c.text} ${c.border} font-heading font-semibold`}>
      <span className="font-mono-data text-sm">{score}</span>
      <span className="text-[11px] tracking-[0.18em]">{category}</span>
    </span>
  );
};

export const TrendIcon = ({ trend }) => {
  if (trend === 'up')   return <TrendingUp size={14} strokeWidth={1.8} className="text-orange-400" />;
  if (trend === 'down') return <TrendingDown size={14} strokeWidth={1.8} className="text-emerald-400" />;
  return <Minus size={14} strokeWidth={1.8} className="text-zinc-500" />;
};

export const KPICard = ({ label, value, unit, sub, tone = 'default', icon: Icon, testid }) => {
  const toneClass = tone === 'safe' ? 'text-emerald-400'
    : tone === 'warning' ? 'text-amber-400'
    : tone === 'critical' ? 'text-red-400'
    : tone === 'info' ? 'text-blue-400'
    : 'text-white';
  return (
    <Panel data-testid={testid} className="p-4 flex flex-col justify-between h-full hover:border-white/20 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <SectionLabel>{label}</SectionLabel>
        {Icon && <Icon size={16} strokeWidth={1.5} className="text-zinc-500" />}
      </div>
      <div className="mt-3">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-mono-data text-3xl font-semibold ${toneClass}`}>{value}</span>
          {unit && <span className="text-xs text-zinc-500">{unit}</span>}
        </div>
        {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
      </div>
    </Panel>
  );
};

export const SeverityBadge = ({ severity }) => {
  const map = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };
  return <span className={`inline-block px-2 py-0.5 rounded-sm border text-[11px] uppercase tracking-wider ${map[severity] || map.low}`}>{severity}</span>;
};

export const EmptyState = ({ title, description }) => (
  <div className="text-center py-10 text-zinc-500">
    <div className="font-heading text-white text-sm mb-1">{title}</div>
    <div className="text-xs">{description}</div>
  </div>
);
