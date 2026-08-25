import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, SeverityBadge, RiskBadge } from '../components/UIBits';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Check, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

const fmtTime = (t) => new Date(t).toLocaleString();

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, assignAlert, resolveAlert, risk } = useApp();
  const [q, setQ] = useState('');
  const [sev, setSev] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => alerts.filter((a) => {
    const matchQ = !q || `${a.id} ${a.description} ${a.zone} ${a.source}`.toLowerCase().includes(q.toLowerCase());
    const matchSev = sev === 'all' || a.severity === sev;
    const matchSt = status === 'all' || a.status === status;
    return matchQ && matchSev && matchSt;
  }), [alerts, q, sev, status]);

  return (
    <div className="space-y-5" data-testid="alerts-page">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <SectionLabel>Risk & Alerts</SectionLabel>
          <h1 className="font-heading font-bold text-3xl mt-1">Alert Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">Current Risk</div>
            <RiskBadge category={risk.category} score={risk.score} />
          </div>
        </div>
      </div>

      <Panel className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search alerts..." className="pl-8 bg-[#0F1116] border-white/10 rounded-sm" data-testid="alert-search" />
        </div>
        <div className="flex flex-wrap gap-1">
          {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
            <button key={s} onClick={() => setSev(s)} className={`text-xs px-3 py-1.5 rounded-sm border capitalize ${sev === s ? 'bg-white/10 border-white/25' : 'border-white/10 hover:border-white/20'}`} data-testid={`sev-${s}`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {['all', 'Active', 'Acknowledged', 'Assigned', 'Resolved'].map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`text-xs px-3 py-1.5 rounded-sm border ${status === s ? 'bg-white/10 border-white/25' : 'border-white/10 hover:border-white/20'}`} data-testid={`st-${s}`}>{s}</button>
          ))}
        </div>
      </Panel>

      <div className="space-y-2">
        {filtered.length === 0 && <Panel className="p-8 text-center text-zinc-500">No alerts match your filters.</Panel>}
        {filtered.map((a) => (
          <Panel key={a.id} className="p-4" data-testid={`alert-item-${a.id}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-3 md:w-64 shrink-0">
                <span className={`w-1.5 h-10 rounded-sm ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'high' ? 'bg-orange-500' : a.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                <div>
                  <div className="font-mono-data text-xs text-zinc-500">{a.id}</div>
                  <SeverityBadge severity={a.severity} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm">{a.description}</div>
                <div className="text-xs text-zinc-500 mt-1">{a.zone} · {a.source} · {fmtTime(a.ts)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest text-zinc-400 px-2 py-1 border border-white/10 rounded-sm">{a.status}</span>
                {a.status === 'Active' && (
                  <Button size="sm" variant="ghost" className="hover:bg-white/10 h-8" onClick={() => { acknowledgeAlert(a.id); toast.success('Alert acknowledged'); }} data-testid={`btn-ack-${a.id}`}><Check size={14} className="mr-1" />Ack</Button>
                )}
                {a.status !== 'Resolved' && (
                  <Button size="sm" variant="ghost" className="hover:bg-white/10 h-8" onClick={() => { assignAlert(a.id, 'Rohan Verma'); toast('Assigned to Rohan Verma'); }} data-testid={`btn-assign-${a.id}`}><UserPlus size={14} className="mr-1" />Assign</Button>
                )}
                {a.status !== 'Resolved' && (
                  <Button size="sm" className="rounded-sm bg-emerald-600 hover:bg-emerald-700 h-8" onClick={() => { resolveAlert(a.id); toast.success('Alert resolved'); }} data-testid={`btn-resolve-${a.id}`}><X size={14} className="mr-1" />Resolve</Button>
                )}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
