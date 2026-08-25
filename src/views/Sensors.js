import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, StatusPill, TrendIcon } from '../components/UIBits';
import { statusFromSensor } from '../simulation/riskEngine';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

export default function Sensors() {
  const { sensors, zones } = useApp();
  const [q, setQ] = useState('');
  const [zone, setZone] = useState('all');

  const filtered = sensors.filter((s) => {
    const zn = zones.find((z) => z.id === s.zone)?.name || '';
    const matchZ = zone === 'all' || s.zone === zone;
    const matchQ = !q || s.label.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase()) || zn.toLowerCase().includes(q.toLowerCase());
    return matchZ && matchQ;
  });

  return (
    <div className="space-y-5" data-testid="sensors-page">
      <div>
        <SectionLabel>IoT Sensors</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">Sensor Registry</h1>
      </div>

      <Panel className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sensor ID, label, zone..." className="pl-8 bg-[#0F1116] border-white/10 rounded-sm" data-testid="sensor-search" />
        </div>
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setZone('all')} className={`text-xs px-3 py-1.5 rounded-sm border ${zone === 'all' ? 'bg-white/10 border-white/25' : 'border-white/10 hover:border-white/20'}`} data-testid="zone-filter-all">All Zones</button>
          {zones.map((z) => (
            <button key={z.id} onClick={() => setZone(z.id)} className={`text-xs px-3 py-1.5 rounded-sm border ${zone === z.id ? 'bg-white/10 border-white/25' : 'border-white/10 hover:border-white/20'}`} data-testid={`zone-filter-${z.id}`}>{z.name}</button>
          ))}
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/30 border-b border-white/10 text-[11px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="text-left p-3">Sensor ID</th>
                <th className="text-left p-3">Label</th>
                <th className="text-left p-3">Zone</th>
                <th className="text-right p-3">Value</th>
                <th className="text-right p-3">Warn / Crit</th>
                <th className="text-left p-3">Trend</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const st = statusFromSensor(s);
                const zn = zones.find((z) => z.id === s.zone)?.name || s.zone;
                return (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200" data-testid={`sensor-row-${s.id}`}>
                    <td className="p-3 font-mono-data text-xs">{s.id}</td>
                    <td className="p-3">{s.label}</td>
                    <td className="p-3 text-zinc-400">{zn}</td>
                    <td className="p-3 text-right font-mono-data">{s.value.toFixed(2)} <span className="text-zinc-500 text-xs">{s.unit}</span></td>
                    <td className="p-3 text-right font-mono-data text-xs text-zinc-400">{s.warn} / {s.crit}</td>
                    <td className="p-3"><TrendIcon trend={s.trend} /></td>
                    <td className="p-3"><StatusPill status={st} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-zinc-500">No sensors match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
