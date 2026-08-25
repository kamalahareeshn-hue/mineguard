import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel } from '../components/UIBits';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

const fmt = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const TT = { background: '#121418', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 };

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function Analytics() {
  const { riskHistory, sensorHistory, complianceHistory, incidents, violations, alerts } = useApp();

  const incidentDist = (() => {
    const map = {};
    [...incidents, ...violations.map((v) => ({ category: v.type }))].forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const violationTrend = (() => {
    const buckets = {};
    violations.forEach((v) => {
      const key = new Date(v.detected).toLocaleDateString();
      buckets[key] = (buckets[key] || 0) + 1;
    });
    return Object.entries(buckets).map(([date, count]) => ({ date, count }));
  })();

  const avgResponse = alerts.length ? Math.round(alerts.filter(a => a.status !== 'Active').length * 6 + 4) : 0;

  return (
    <div className="space-y-5" data-testid="analytics-page">
      <div>
        <SectionLabel>Analytics</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">Operational Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-5">
          <SectionLabel>Risk Score Trend</SectionLabel>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={riskHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tickFormatter={fmt} stroke="#71717A" style={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#71717A" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={TT} labelFormatter={fmt} />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Compliance Trend</SectionLabel>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={complianceHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tickFormatter={fmt} stroke="#71717A" style={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} stroke="#71717A" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={TT} labelFormatter={fmt} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Sensor Trends (Methane / Dust / Temperature)</SectionLabel>
          <div className="h-56 mt-3">
            <ResponsiveContainer>
              <LineChart data={sensorHistory}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="t" tickFormatter={fmt} stroke="#71717A" style={{ fontSize: 11 }} />
                <YAxis stroke="#71717A" style={{ fontSize: 11 }} />
                <Tooltip contentStyle={TT} labelFormatter={fmt} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#A1A1AA' }} />
                <Line type="monotone" dataKey="methane" stroke="#EF4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="dust" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temperature" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Incident Distribution</SectionLabel>
          <div className="h-56 mt-3">
            {incidentDist.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-zinc-500">No incident data yet.</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={incidentDist} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40}>
                    {incidentDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={TT} />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#A1A1AA' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Violation Trend</SectionLabel>
          <div className="h-56 mt-3">
            {violationTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-zinc-500">No violations recorded.</div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={violationTrend}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#71717A" style={{ fontSize: 11 }} />
                  <YAxis stroke="#71717A" style={{ fontSize: 11 }} />
                  <Tooltip contentStyle={TT} />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Average Alert Response</SectionLabel>
          <div className="h-56 mt-3 flex flex-col items-center justify-center">
            <div className="font-mono-data text-6xl font-bold text-blue-400">{avgResponse}</div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 mt-2">Seconds</div>
            <div className="text-xs text-zinc-500 mt-2 text-center">Simulated across {alerts.length} alerts. Lower is better.</div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
