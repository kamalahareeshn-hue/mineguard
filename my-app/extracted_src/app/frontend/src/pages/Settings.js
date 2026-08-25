import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel } from '../components/UIBits';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export default function Settings() {
  const { sensors, thresholds, updateThreshold, activeMine, mines } = useApp();
  const [notif, setNotif] = React.useState({ dashboard: true, sms: false, email: true, mobile: true, alarm: true });

  return (
    <div className="space-y-5" data-testid="settings-page">
      <div>
        <SectionLabel>Settings</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">System Configuration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel className="p-5">
          <SectionLabel>Mine Configuration</SectionLabel>
          <div className="mt-3 space-y-2">
            <div>
              <Label className="text-xs uppercase tracking-widest text-zinc-500">Active Mine</Label>
              <Input value={mines.find((m) => m.id === activeMine)?.name || ''} readOnly className="mt-1 bg-[#0F1116] border-white/10 rounded-sm" data-testid="setting-mine" />
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionLabel>Notification Preferences</SectionLabel>
          <div className="mt-3 space-y-2.5">
            {Object.entries({ dashboard: 'Dashboard toast', sms: 'SMS (simulated)', email: 'Email (simulated)', mobile: 'Mobile push (simulated)', alarm: 'Emergency alarm' }).map(([k, label]) => (
              <div key={k} className="flex items-center justify-between border border-white/10 rounded-sm px-3 py-2">
                <span className="text-sm">{label}</span>
                <Switch checked={notif[k]} onCheckedChange={(v) => setNotif({ ...notif, [k]: v })} data-testid={`notif-${k}`} />
              </div>
            ))}
            <div className="text-[11px] text-zinc-500 leading-relaxed">Real SMS/email/push are not dispatched. Demo notifications only.</div>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionLabel>Alert Thresholds (edit-live)</SectionLabel>
        <p className="text-xs text-zinc-500 mt-1">Changing thresholds immediately affects the risk engine and alert generation.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/30 border-b border-white/10 text-[11px] uppercase tracking-widest text-zinc-500">
              <tr>
                <th className="text-left p-3">Sensor</th>
                <th className="text-right p-3">Current</th>
                <th className="text-right p-3">Warning</th>
                <th className="text-right p-3">Critical</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((s) => (
                <tr key={s.id} className="border-b border-white/5" data-testid={`threshold-row-${s.id}`}>
                  <td className="p-3">
                    <div>{s.label}</div>
                    <div className="text-[10px] text-zinc-500 font-mono-data">{s.id}</div>
                  </td>
                  <td className="p-3 text-right font-mono-data">{s.value.toFixed(2)} {s.unit}</td>
                  <td className="p-3 text-right">
                    <Input
                      type="number"
                      step="0.1"
                      value={thresholds[s.id]?.warn ?? s.warn}
                      onChange={(e) => updateThreshold(s.id, { warn: parseFloat(e.target.value) })}
                      className="ml-auto w-24 h-8 bg-[#0F1116] border-white/10 rounded-sm text-right font-mono-data"
                      data-testid={`warn-${s.id}`}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <Input
                      type="number"
                      step="0.1"
                      value={thresholds[s.id]?.crit ?? s.crit}
                      onChange={(e) => { updateThreshold(s.id, { crit: parseFloat(e.target.value) }); }}
                      onBlur={() => toast.success(`Thresholds updated for ${s.id}`)}
                      className="ml-auto w-24 h-8 bg-[#0F1116] border-white/10 rounded-sm text-right font-mono-data"
                      data-testid={`crit-${s.id}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
