import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel } from '../components/UIBits';
import { Progress } from '../components/ui/progress';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fmtDate = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Compliance() {
  const { complianceScore, complianceCategories, complianceHistory, violations } = useApp();
  const openV = violations.filter((v) => v.status !== 'Resolved').length;

  return (
    <div className="space-y-5" data-testid="compliance-page">
      <div>
        <SectionLabel>Compliance</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">Regulatory & Safety Compliance</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="p-6">
          <SectionLabel>Overall Compliance</SectionLabel>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono-data text-6xl font-bold text-blue-400" data-testid="overall-compliance">{complianceScore}%</span>
          </div>
          <Progress value={complianceScore} className="mt-4 h-2 bg-white/5" />
          <div className="mt-3 text-xs text-zinc-500">
            {openV} open violation{openV !== 1 ? 's' : ''} · updated in real time
          </div>
        </Panel>

        <Panel className="p-5 lg:col-span-2">
          <SectionLabel>Compliance Trend</SectionLabel>
          <div className="h-40 mt-3">
            <ResponsiveContainer>
              <LineChart data={complianceHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tickFormatter={fmtDate} stroke="#71717A" style={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#71717A" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#121418', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }} labelFormatter={fmtDate} />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionLabel>Category Breakdown</SectionLabel>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceCategories.map((c) => {
            const tone = c.score >= 85 ? 'text-emerald-400' : c.score >= 70 ? 'text-amber-400' : 'text-red-400';
            const bar = c.score >= 85 ? 'bg-emerald-500' : c.score >= 70 ? 'bg-amber-500' : 'bg-red-500';
            return (
              <div key={c.id} className="border border-white/10 rounded-sm p-4 bg-[#0F1116]" data-testid={`compliance-cat-${c.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{c.label}</span>
                  <span className={`font-mono-data font-semibold ${tone}`}>{c.score}%</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-sm overflow-hidden">
                  <div className={`h-full ${bar} transition-all duration-500`} style={{ width: `${c.score}%` }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-mono-data text-emerald-400 text-sm">{c.passed}</div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500">Passed</div>
                  </div>
                  <div>
                    <div className="font-mono-data text-red-400 text-sm">{c.failed}</div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500">Failed</div>
                  </div>
                  <div>
                    <div className="font-mono-data text-amber-400 text-sm">{c.pending}</div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500">Pending</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
