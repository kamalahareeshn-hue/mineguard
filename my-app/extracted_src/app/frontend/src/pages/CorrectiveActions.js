import React from 'react';
import { useApp } from '../context/AppContext';
import { Panel, SectionLabel, SeverityBadge } from '../components/UIBits';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Check, ChevronRight } from 'lucide-react';

const STAGES = ['Assigned', 'Investigation', 'Corrective Action', 'Verification', 'Resolved'];
const fmt = (t) => new Date(t).toLocaleDateString();

export default function CorrectiveActions() {
  const { actions, updateAction } = useApp();
  return (
    <div className="space-y-5" data-testid="actions-page">
      <div>
        <SectionLabel>Corrective Actions</SectionLabel>
        <h1 className="font-heading font-bold text-3xl mt-1">Corrective Action Workflow</h1>
      </div>

      <div className="space-y-3">
        {actions.length === 0 && <Panel className="p-8 text-center text-zinc-500">No corrective actions yet.</Panel>}
        {actions.map((a) => {
          const stageIdx = STAGES.indexOf(a.stage);
          const done = a.stage === 'Resolved';
          return (
            <Panel key={a.id} className="p-4" data-testid={`action-item-${a.id}`}>
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-data text-xs text-zinc-500">{a.id}</span>
                    <SeverityBadge severity={a.priority?.toLowerCase() || 'medium'} />
                    <span className="text-[11px] text-zinc-400 px-2 py-0.5 border border-white/10 rounded-sm">Ref: {a.violationId}</span>
                  </div>
                  <div className="text-sm mt-1.5">{a.description}</div>
                  <div className="text-xs text-zinc-500 mt-1">Assignee: <span className="text-zinc-300">{a.assignee}</span> · Deadline: {fmt(a.deadline)}</div>
                </div>
                <div className="flex items-start gap-2">
                  {!done && (
                    <Button size="sm" className="h-8 rounded-sm bg-blue-600 hover:bg-blue-700" onClick={() => { const next = STAGES[Math.min(STAGES.length - 1, stageIdx + 1)]; updateAction(a.id, { stage: next, ...(next === 'Resolved' ? { completed: Date.now() } : {}) }); toast.success(`Advanced to ${next}`); }} data-testid={`btn-advance-${a.id}`}>
                      <ChevronRight size={14} className="mr-1" /> Advance
                    </Button>
                  )}
                  {done && <span className="text-emerald-400 text-xs flex items-center gap-1"><Check size={14} /> Complete</span>}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1">
                {STAGES.map((s, idx) => {
                  const active = idx <= stageIdx;
                  return (
                    <React.Fragment key={s}>
                      <div className={`px-2.5 py-1 rounded-sm text-[11px] border whitespace-nowrap ${active ? 'bg-blue-500/10 text-blue-300 border-blue-500/40' : 'text-zinc-500 border-white/10'}`}>{s}</div>
                      {idx < STAGES.length - 1 && <span className={`text-[10px] ${idx < stageIdx ? 'text-blue-500' : 'text-zinc-700'}`}>—</span>}
                    </React.Fragment>
                  );
                })}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
