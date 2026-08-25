import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, StatusPill, TrendIcon, RiskBadge } from '../components/UIBits';
import { statusFromSensor } from '../simulation/riskEngine';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export default function LiveMonitoring() {
  const { sensors, sensorHistory, risk, zones } = useApp();

  return (
    <div className="space-y-5" data-testid="live-monitoring-page">
      <div>
        <SectionLabel>Live Monitoring</SectionLabel>
        <div className="flex items-center justify-between mt-1">
          <h1 className="font-heading font-bold text-3xl">Real-Time Sensor Telemetry</h1>
          <RiskBadge category={risk.category} score={risk.score} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel className="p-5">
          <SectionLabel>Methane / Dust / Temperature Trend</SectionLabel>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <LineChart data={sensorHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tickFormatter={fmtTime} stroke="#71717A" style={{ fontSize: 11 }} />
                <YAxis stroke="#71717A" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#121418', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }} labelFormatter={fmtTime} />
                <Line type="monotone" dataKey="methane" stroke="#EF4444" strokeWidth={2} dot={false} name="Methane (%LEL)" />
                <Line type="monotone" dataKey="dust" stroke="#F59E0B" strokeWidth={2} dot={false} name="Dust (mg/m³)" />
                <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Zone Status</SectionLabel>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {zones.map((z) => {
              const zoneSensors = sensors.filter((s) => s.zone === z.id);
              const worst = zoneSensors.reduce((acc, s) => {
                const st = statusFromSensor(s);
                if (st === 'critical') return 'critical';
                if (st === 'warning' && acc !== 'critical') return 'warning';
                return acc;
              }, 'safe');
              return (
                <div key={z.id} className="border border-white/10 rounded-sm p-3 bg-[#0F1116]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{z.name}</span>
                    <StatusPill status={worst} />
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 flex justify-between">
                    <span>{z.workers} workers</span>
                    <span>{zoneSensors.length} sensors</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionLabel>All Sensor Readings</SectionLabel>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sensors.map((s) => {
            const status = statusFromSensor(s);
            const tone = status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-amber-400' : 'text-emerald-400';
            const pct = Math.max(0, Math.min(100, ((s.value - s.min) / (s.max - s.min)) * 100));
            const barColor = status === 'critical' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';
            return (
              <div key={s.id} className="border border-white/10 rounded-sm p-4 bg-[#0F1116]" data-testid={`sensor-card-${s.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{s.label}</span>
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className={`font-mono-data text-3xl font-semibold ${tone}`}>{s.value.toFixed(1)}</span>
                  <span className="text-[11px] text-zinc-500">{s.unit}</span>
                  <span className="ml-auto"><TrendIcon trend={s.trend} /></span>
                </div>
                <div className="mt-3 h-1 bg-white/5 rounded-sm overflow-hidden">
                  <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-2 text-[10px] text-zinc-500 flex justify-between">
                  <span>Warn {s.warn}</span>
                  <span>Crit {s.crit}</span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 font-mono-data">{s.id}</div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
