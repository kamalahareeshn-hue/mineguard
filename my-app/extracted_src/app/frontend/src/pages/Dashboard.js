import React from 'react';
import { useApp } from '../context/AppContext';
import { KPICard, Panel, SectionLabel, RiskBadge, StatusPill, SeverityBadge } from '../components/UIBits';
import { Shield, ClipboardCheck, Bell, AlertOctagon, Users, Cpu, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/button';
import { statusFromSensor } from '../simulation/riskEngine';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const fmtTime = (t) => new Date(t).toLocaleTimeString();

export default function Dashboard() {
  const { kpi, risk, sensors, alerts, incidents, zones, demoMode, startDemo, pauseDemo, resetDemo, riskHistory, simMode, setSimMode } = useApp();
  const navigate = useNavigate();
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-5" data-testid="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>Command Center</SectionLabel>
          <h1 className="font-heading font-bold text-3xl mt-1">Mine Safety Overview</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 border border-white/10 rounded-sm p-1 bg-[#121418]">
            {['normal', 'warning', 'critical'].map((m) => (
              <button
                key={m}
                onClick={() => setSimMode(m)}
                data-testid={`sim-mode-${m}`}
                className={`px-3 py-1 text-xs uppercase tracking-wider rounded-sm transition-colors duration-200 ${simMode === m ? (m === 'critical' ? 'bg-red-500/20 text-red-400' : m === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400') : 'text-zinc-400 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>
          {!demoMode.active ? (
            <Button onClick={startDemo} className="rounded-sm bg-blue-600 hover:bg-blue-700 gap-2" data-testid="btn-start-demo">
              <Play size={14} /> Start Demo Mode
            </Button>
          ) : (
            <>
              <Button onClick={pauseDemo} className="rounded-sm bg-amber-600 hover:bg-amber-700 gap-2" data-testid="btn-pause-demo"><Pause size={14} /> Pause</Button>
              <Button onClick={resetDemo} className="rounded-sm bg-zinc-700 hover:bg-zinc-600 gap-2" data-testid="btn-reset-demo"><RotateCcw size={14} /> Reset</Button>
            </>
          )}
        </div>
      </div>

      {demoMode.active && (
        <Panel className="p-3 flex items-center gap-3 border-blue-500/30 bg-blue-500/5">
          <Zap size={16} className="text-blue-400" />
          <span className="text-sm">Demo Mode active — step <span className="font-mono-data font-semibold text-blue-400">{demoMode.step}/17</span></span>
        </Panel>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard testid="kpi-safety" label="Overall Safety" value={`${kpi.overallSafety}%`} sub={kpi.overallSafety > 80 ? 'SAFE' : kpi.overallSafety > 60 ? 'WARNING' : 'CRITICAL'} tone={kpi.overallSafety > 80 ? 'safe' : kpi.overallSafety > 60 ? 'warning' : 'critical'} icon={Shield} />
        <KPICard testid="kpi-compliance" label="Compliance Score" value={`${kpi.complianceScore}%`} sub="7 categories" tone="info" icon={ClipboardCheck} />
        <KPICard testid="kpi-alerts" label="Active Alerts" value={String(kpi.activeAlertCount).padStart(2, '0')} sub={`${alerts.length} total`} tone={kpi.activeAlertCount > 3 ? 'warning' : 'default'} icon={Bell} />
        <KPICard testid="kpi-critical" label="Critical Incidents" value={String(kpi.criticalIncidents).padStart(2, '0')} sub={`${incidents.length} open`} tone={kpi.criticalIncidents > 0 ? 'critical' : 'default'} icon={AlertOctagon} />
        <KPICard testid="kpi-workers" label="Workers Present" value={kpi.workersPresent} sub={`${zones.length} zones`} icon={Users} />
        <KPICard testid="kpi-sensors" label="Connected Sensors" value={`${kpi.connectedSensors.active}/${kpi.connectedSensors.total}`} sub="Online" tone="safe" icon={Cpu} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk engine explainability */}
        <Panel className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SectionLabel>AI Risk Engine · Explainability</SectionLabel>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-mono-data text-5xl font-bold">{risk.score}</span>
                <RiskBadge category={risk.category} score={risk.score} />
              </div>
              <div className="text-xs text-zinc-500 mt-1">Score updates in real time based on sensors, CCTV events and open incidents.</div>
            </div>
            <div className="h-24 w-52 hidden sm:block">
              <ResponsiveContainer>
                <LineChart data={riskHistory}>
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SectionLabel>Top Contributing Factors</SectionLabel>
              <ul className="mt-2 space-y-1.5">
                {risk.factors.length === 0 && <li className="text-sm text-emerald-400">No significant risk factors detected.</li>}
                {risk.factors.map((f, i) => (
                  <li key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
                    <span className="text-zinc-300">{f.label}</span>
                    <span className="font-mono-data text-xs text-amber-400">+{f.weight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionLabel>Recommended Action</SectionLabel>
              <div className="mt-2 text-sm text-zinc-300 leading-relaxed border border-white/10 rounded-sm p-3 bg-black/20">
                {risk.recommendation}
              </div>
            </div>
          </div>
        </Panel>

        {/* Recent alerts */}
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <SectionLabel>Recent Alerts</SectionLabel>
            <button onClick={() => navigate('/app/alerts')} className="text-xs text-blue-400 hover:underline" data-testid="link-all-alerts">View all</button>
          </div>
          <div className="mt-3 space-y-2">
            {recentAlerts.length === 0 && <div className="text-sm text-zinc-500">No alerts yet. System nominal.</div>}
            {recentAlerts.map((a) => (
              <div key={a.id} className="border border-white/10 rounded-sm p-2.5" data-testid={`alert-row-${a.id}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono-data text-xs text-zinc-500">{a.id}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <div className="text-sm mt-1">{a.description}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{a.zone} · {a.source} · {fmtTime(a.ts)}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Real-time mine status */}
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <SectionLabel>Real-Time Mine Status</SectionLabel>
            <div className="font-heading font-semibold text-lg mt-1">Environmental & Equipment Parameters</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {sensors.map((s) => {
            const status = statusFromSensor(s);
            const tone = status === 'critical' ? 'text-red-400' : status === 'warning' ? 'text-amber-400' : 'text-emerald-400';
            return (
              <div key={s.id} className="border border-white/10 rounded-sm p-3 bg-[#0F1116] hover:border-white/20 transition-colors duration-200" data-testid={`mini-sensor-${s.id}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{s.label}</span>
                  <StatusPill status={status} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`font-mono-data text-2xl font-semibold ${tone}`}>{s.value.toFixed(1)}</span>
                  <span className="text-[10px] text-zinc-500">{s.unit}</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Safe &lt; {s.warn} · Crit &gt; {s.crit}</div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Zones summary */}
      <Panel className="p-5">
        <SectionLabel>Mine Zones</SectionLabel>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {zones.map((z) => {
            const zoneSensors = sensors.filter((s) => s.zone === z.id);
            const worst = zoneSensors.reduce((acc, s) => {
              const st = statusFromSensor(s);
              if (st === 'critical') return 'critical';
              if (st === 'warning' && acc !== 'critical') return 'warning';
              return acc;
            }, 'safe');
            return (
              <button
                key={z.id}
                onClick={() => navigate('/app/live')}
                className="text-left border border-white/10 rounded-sm p-3 hover:border-white/25 transition-colors duration-200 bg-[#0F1116]"
                data-testid={`zone-${z.id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{z.name}</span>
                  <StatusPill status={worst} />
                </div>
                <div className="text-xs text-zinc-500 mt-1">{z.workers} workers · {zoneSensors.length} sensors</div>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
