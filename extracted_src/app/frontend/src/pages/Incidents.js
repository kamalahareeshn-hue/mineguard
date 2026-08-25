import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, SeverityBadge } from '../components/UIBits';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { toast } from 'sonner';

const fmt = (t) => new Date(t).toLocaleString();
const STATUSES = ['Open', 'Investigating', 'Corrective Action', 'Resolved'];

export default function Incidents() {
  const { incidents, updateIncident, violations } = useApp();
  const [q, setQ] = useState('');
  const [detail, setDetail] = useState(null);

  const list = [
    ...incidents.map((i) => ({ ...i, kind: 'incident' })),
    ...violations.map((v) => ({ id: v.id, ts: v.detected, category: v.type, severity: v.severity, zone: v.zone, description: `Detected in zone ${v.zone}.`, status: v.status, assignee: v.officer, kind: 'violation' })),
  ].sort((a, b) => b.ts - a.ts);

  const filtered = list.filter((i) => !q || `${i.id} ${i.category} ${i.zone} ${i.description}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5" data-testid="incidents-page">
      <div>
        <SectionLabel>Incidents & Violations</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">Incident Management</h1>
      </div>

      <Panel className="p-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search incidents..." className="pl-8 bg-[#0F1116] border-white/10 rounded-sm" data-testid="incident-search" />
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/30 border-b border-white/10 text-[11px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Zone</th>
                <th className="text-left p-3">Severity</th>
                <th className="text-left p-3">Detected</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Officer</th>
                <th className="text-right p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.kind + i.id} className="border-b border-white/5 hover:bg-white/5" data-testid={`incident-row-${i.id}`}>
                  <td className="p-3 font-mono-data text-xs">{i.id}</td>
                  <td className="p-3">{i.category}</td>
                  <td className="p-3 text-zinc-400">{i.zone}</td>
                  <td className="p-3"><SeverityBadge severity={i.severity} /></td>
                  <td className="p-3 text-xs text-zinc-400">{fmt(i.ts)}</td>
                  <td className="p-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-sm border ${i.status === 'Resolved' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>{i.status}</span>
                  </td>
                  <td className="p-3 text-xs text-zinc-400">{i.assignee}</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 hover:bg-white/10" onClick={() => setDetail(i)} data-testid={`btn-view-${i.id}`}>View</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-zinc-500">No incidents recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="bg-[#121418] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">Incident {detail?.id}</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <SeverityBadge severity={detail.severity} />
                <span className="text-xs text-zinc-500">{fmt(detail.ts)}</span>
              </div>
              <div><span className="text-xs uppercase tracking-widest text-zinc-500">Category</span><div>{detail.category}</div></div>
              <div><span className="text-xs uppercase tracking-widest text-zinc-500">Zone</span><div>{detail.zone}</div></div>
              <div><span className="text-xs uppercase tracking-widest text-zinc-500">Description</span><div className="text-zinc-300">{detail.description}</div></div>
              <div><span className="text-xs uppercase tracking-widest text-zinc-500">Assignee</span><div>{detail.assignee}</div></div>
              <div>
                <span className="text-xs uppercase tracking-widest text-zinc-500">Status</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {STATUSES.map((s) => (
                    <button key={s} onClick={() => { if (detail.kind === 'incident') updateIncident(detail.id, { status: s }); setDetail({ ...detail, status: s }); toast(`Status → ${s}`); }} className={`text-xs px-2.5 py-1 rounded-sm border ${detail.status === s ? 'bg-white/10 border-white/25' : 'border-white/10 hover:border-white/20'}`} data-testid={`status-btn-${s}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" className="hover:bg-white/10" onClick={() => setDetail(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
