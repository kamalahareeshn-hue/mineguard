import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, SeverityBadge } from '../components/UIBits';
import { Button } from '../components/ui/button';
import { EyeOff, ShieldCheck, Radio } from 'lucide-react';
import { toast } from 'sonner';

const fmtTime = (t) => new Date(t).toLocaleTimeString();

const CameraTile = ({ cam, events, onAck, onIncident }) => {
  const latest = events.find((e) => e.cameraId === cam.id && !e.acknowledged);
  return (
    <div className="border border-white/10 rounded-sm overflow-hidden bg-[#0F1116] hover:border-white/25 transition-colors duration-200" data-testid={`camera-${cam.id}`}>
      <div className="relative aspect-video bg-black overflow-hidden">
        <img src={cam.img} alt={cam.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] text-white font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot"></span>
          <span className="uppercase tracking-widest">Live · {cam.id}</span>
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono-data text-white/80">{fmtTime(Date.now())}</div>
        <div className="absolute bottom-2 left-2 text-xs text-white font-medium">{cam.name}</div>
        {latest && (
          <div className="absolute inset-x-2 bottom-10 border border-red-500/50 bg-red-500/20 backdrop-blur-sm rounded-sm p-2 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-red-300 font-bold">AI Detection</span>
              <SeverityBadge severity={latest.severity} />
            </div>
            <div className="text-xs text-white mt-1">{latest.label}</div>
            <div className="text-[10px] text-white/70">Confidence: {latest.confidence}%</div>
          </div>
        )}
      </div>
      <div className="p-2.5 flex gap-2">
        <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs hover:bg-white/10" disabled={!latest} onClick={() => { onAck(latest.id); toast.success('Alert acknowledged'); }} data-testid={`btn-ack-${cam.id}`}>Acknowledge</Button>
        <Button size="sm" className="flex-1 h-7 text-xs rounded-sm bg-red-600 hover:bg-red-700" disabled={!latest} onClick={() => onIncident(latest)} data-testid={`btn-incident-${cam.id}`}>Create Incident</Button>
      </div>
    </div>
  );
};

export default function CCTV() {
  const { cameras, cctvEvents, acknowledgeCctv, createIncidentFromCctv } = useApp();
  return (
    <div className="space-y-5" data-testid="cctv-page">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <SectionLabel>CCTV & AI Vision</SectionLabel>
          <h1 className="font-heading font-bold text-3xl mt-1">Live Camera Grid</h1>
          <p className="text-xs text-zinc-500 mt-1">All feeds analyzed on-device. Only safety events and aggregate activity are stored.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-sm px-3 py-1.5 text-xs flex items-center gap-2">
            <EyeOff size={12} strokeWidth={1.8} /> Privacy-Aware · No Facial Recognition
          </div>
          <div className="border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-sm px-3 py-1.5 text-xs flex items-center gap-2">
            <ShieldCheck size={12} strokeWidth={1.8} /> Safety events only
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 border border-white/10 rounded-sm p-1 bg-[#0B0D11]">
        {cameras.map((c) => (
          <CameraTile key={c.id} cam={c} events={cctvEvents} onAck={acknowledgeCctv} onIncident={createIncidentFromCctv} />
        ))}
      </div>

      <Panel className="p-5">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-blue-400" />
          <SectionLabel>AI Detection Feed</SectionLabel>
        </div>
        <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
          {cctvEvents.length === 0 && <div className="text-sm text-zinc-500">No AI detections yet. Increase simulation mode to trigger events.</div>}
          {cctvEvents.map((e) => (
            <div key={e.id} className="border border-white/10 rounded-sm p-2.5 flex items-center gap-3" data-testid={`cctv-event-${e.id}`}>
              <span className="font-mono-data text-[11px] text-zinc-500 w-24 shrink-0">{fmtTime(e.ts)}</span>
              <span className="font-mono-data text-xs text-zinc-400 w-16 shrink-0">{e.cameraId}</span>
              <span className="text-sm flex-1 min-w-0 truncate">{e.label}</span>
              <span className="text-xs text-zinc-500 hidden sm:block">Conf {e.confidence}%</span>
              <SeverityBadge severity={e.severity} />
              {e.acknowledged && <span className="text-[10px] text-emerald-400 uppercase tracking-widest">Ack</span>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
