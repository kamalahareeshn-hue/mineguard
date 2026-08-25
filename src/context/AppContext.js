import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { SENSOR_SEED, CAMERAS, ZONES, MINES, DEMO_USERS, SEED_VIOLATIONS, SEED_ACTIONS, COMPLIANCE_CATEGORIES, AI_DETECTION_TYPES } from '../data/mockData';
import { computeRisk, statusFromSensor } from '../simulation/riskEngine';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const LS_KEY = 'mineguard.state.v1';

const nextId = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

const initialSensors = () => SENSOR_SEED.map((s) => ({ ...s, value: s.base, trend: 'stable' }));

const loadPersisted = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export function AppProvider({ children }) {
  const persisted = loadPersisted();

  const [user, setUser] = useState(() => {
    if (persisted && persisted.user !== undefined) return persisted.user;
    return DEMO_USERS[0];
  });
  const [activeMine, setActiveMine] = useState(persisted?.activeMine || MINES[0].id);
  const [simMode, setSimMode] = useState('normal'); // normal | warning | critical
  const [emergency, setEmergency] = useState(false);
  const [demoMode, setDemoMode] = useState({ active: false, step: 0, paused: false });

  const [sensors, setSensors] = useState(initialSensors());
  const [thresholds, setThresholds] = useState(
    persisted?.thresholds || Object.fromEntries(SENSOR_SEED.map((s) => [s.id, { warn: s.warn, crit: s.crit }]))
  );

  const [alerts, setAlerts] = useState(persisted?.alerts || []);
  const [incidents, setIncidents] = useState(persisted?.incidents || []);
  const [violations, setViolations] = useState(persisted?.violations || SEED_VIOLATIONS);
  const [actions, setActions] = useState(persisted?.actions || SEED_ACTIONS);
  const [cctvEvents, setCctvEvents] = useState([]);

  // Risk history & compliance history for charts
  const [riskHistory, setRiskHistory] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 20 }).map((_, i) => ({ t: now - (20 - i) * 60000, score: 15 + Math.round(Math.random() * 10) }));
  });
  const [sensorHistory, setSensorHistory] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 20 }).map((_, i) => ({
      t: now - (20 - i) * 60000,
      methane: 10 + Math.random() * 5,
      dust: 3 + Math.random() * 1.5,
      temperature: 27 + Math.random() * 2,
    }));
  });
  const [complianceHistory, setComplianceHistory] = useState(() => {
    const now = Date.now();
    return Array.from({ length: 12 }).map((_, i) => ({ t: now - (12 - i) * 3600e3, score: 84 + Math.round(Math.random() * 6) }));
  });

  // Persist critical slices to localStorage
  useEffect(() => {
    const toSave = { user, activeMine, thresholds, alerts, incidents, violations, actions };
    try { localStorage.setItem(LS_KEY, JSON.stringify(toSave)); } catch (e) { /* ignore quota */ }
  }, [user, activeMine, thresholds, alerts, incidents, violations, actions]);

  // Merge editable thresholds into sensor defs
  const sensorsWithThresholds = useMemo(
    () => sensors.map((s) => ({ ...s, warn: thresholds[s.id]?.warn ?? s.warn, crit: thresholds[s.id]?.crit ?? s.crit })),
    [sensors, thresholds]
  );

  // Simulation tick — sensor random walk influenced by simMode & demoMode
  const tickRef = useRef(0);
  useEffect(() => {
    const iv = setInterval(() => {
      tickRef.current += 1;
      setSensors((prev) => prev.map((s) => {
        let drift = (Math.random() - 0.5) * (s.max * 0.02);
        // Simulation mode influence
        if (simMode === 'warning') drift += s.max * 0.008;
        if (simMode === 'critical') drift += s.max * 0.02;
        // Emergency further pushes methane & CO
        if (emergency && (s.type === 'methane' || s.type === 'co')) drift += s.max * 0.03;
        let v = s.value + drift;
        v = Math.max(s.min, Math.min(s.max, v));
        const trend = v > s.value + 0.05 ? 'up' : v < s.value - 0.05 ? 'down' : 'stable';
        return { ...s, value: v, trend };
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, [simMode, emergency]);

  // History updates
  useEffect(() => {
    const iv = setInterval(() => {
      const meth = sensors.find((x) => x.type === 'methane')?.value ?? 0;
      const dust = sensors.find((x) => x.type === 'dust')?.value ?? 0;
      const temp = sensors.find((x) => x.type === 'temperature')?.value ?? 0;
      setSensorHistory((h) => [...h.slice(-29), { t: Date.now(), methane: +meth.toFixed(2), dust: +dust.toFixed(2), temperature: +temp.toFixed(2) }]);
    }, 5000);
    return () => clearInterval(iv);
  }, [sensors]);

  // Auto-generate alerts when a sensor first crosses threshold (edge trigger)
  const lastStatusRef = useRef({});
  useEffect(() => {
    sensorsWithThresholds.forEach((s) => {
      const status = statusFromSensor(s);
      const prev = lastStatusRef.current[s.id];
      if (prev !== status && (status === 'warning' || status === 'critical')) {
        const severity = status === 'critical' ? 'critical' : 'high';
        const zoneName = ZONES.find((z) => z.id === s.zone)?.name || s.zone;
        const alert = {
          id: nextId('ALR'),
          ts: Date.now(),
          severity,
          zone: zoneName,
          source: `IoT Sensor ${s.id}`,
          description: `${s.label} ${status === 'critical' ? 'exceeded CRITICAL threshold' : 'above WARNING threshold'} — reading ${s.value.toFixed(1)} ${s.unit}.`,
          status: 'Active',
          sensorId: s.id,
        };
        setAlerts((a) => [alert, ...a].slice(0, 200));
        if (severity === 'critical') {
          toast.error('CRITICAL ALERT', { description: alert.description });
        } else {
          toast.warning('Warning Alert', { description: alert.description });
        }
      }
      lastStatusRef.current[s.id] = status;
    });
  }, [sensorsWithThresholds]);

  // Random CCTV AI detections (rare in normal mode, frequent in critical/demo)
  useEffect(() => {
    const iv = setInterval(() => {
      const p = simMode === 'critical' ? 0.55 : simMode === 'warning' ? 0.25 : 0.08;
      if (Math.random() > p) return;
      const cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
      const det = AI_DETECTION_TYPES[Math.floor(Math.random() * AI_DETECTION_TYPES.length)];
      const conf = 78 + Math.floor(Math.random() * 20);
      const ev = { id: nextId('DET'), ts: Date.now(), cameraId: cam.id, cameraName: cam.name, zone: cam.zone, type: det.key, label: det.label, severity: det.severity, confidence: conf, acknowledged: false };
      setCctvEvents((e) => [ev, ...e].slice(0, 40));
    }, 6000);
    return () => clearInterval(iv);
  }, [simMode]);

  // Risk score & history
  const activeUnackAlerts = useMemo(() => alerts.filter((a) => a.status === 'Active'), [alerts]);
  const openIncidents = useMemo(() => incidents.filter((i) => i.status !== 'Resolved').length, [incidents]);
  const recentCctv = useMemo(() => cctvEvents.filter((e) => Date.now() - e.ts < 60000).length, [cctvEvents]);
  const risk = useMemo(
    () => computeRisk({ sensors: sensorsWithThresholds, activeAlerts: activeUnackAlerts, openIncidents, cctvEventsLastMin: recentCctv }),
    [sensorsWithThresholds, activeUnackAlerts, openIncidents, recentCctv]
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setRiskHistory((h) => [...h.slice(-29), { t: Date.now(), score: risk.score }]);
    }, 5000);
    return () => clearInterval(iv);
  }, [risk.score]);

  // Compliance score derived from open violations + incidents + risk
  const complianceCategories = useMemo(() => {
    const openViolationsByZone = violations.filter((v) => v.status !== 'Resolved').length;
    return COMPLIANCE_CATEGORIES.map((c) => {
      let score = c.base;
      if (c.id === 'worker') score -= Math.min(20, openIncidents * 4 + activeUnackAlerts.length * 2);
      if (c.id === 'air') score -= Math.min(15, sensorsWithThresholds.filter((s) => (s.type === 'methane' || s.type === 'air' || s.type === 'co') && statusFromSensor(s) !== 'safe').length * 5);
      if (c.id === 'env') score -= Math.min(15, openViolationsByZone * 3);
      if (c.id === 'equip') score -= Math.min(12, sensorsWithThresholds.filter((s) => s.type === 'vibration' && statusFromSensor(s) !== 'safe').length * 6);
      const passed = Math.max(1, Math.round(score / 4));
      const failed = Math.max(0, Math.round((100 - score) / 8));
      const pending = Math.max(1, Math.round((100 - score) / 12));
      return { ...c, score: Math.max(30, Math.min(100, score)), passed, failed, pending };
    });
  }, [violations, openIncidents, activeUnackAlerts.length, sensorsWithThresholds]);

  const complianceScore = useMemo(
    () => Math.round(complianceCategories.reduce((a, c) => a + c.score, 0) / complianceCategories.length),
    [complianceCategories]
  );

  useEffect(() => {
    const iv = setInterval(() => {
      setComplianceHistory((h) => [...h.slice(-19), { t: Date.now(), score: complianceScore }]);
    }, 10000);
    return () => clearInterval(iv);
  }, [complianceScore]);

  // --- Actions API ---
  const login = useCallback((username, password) => {
    const u = DEMO_USERS.find((x) => x.username === username && x.password === password);
    if (u) { setUser(u); return true; }
    return false;
  }, []);
  const logout = useCallback(() => setUser(null), []);

  const acknowledgeAlert = (id) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, status: 'Acknowledged' } : x));
  const assignAlert = (id, officer) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, status: 'Assigned', assignee: officer } : x));
  const resolveAlert = (id) => setAlerts((a) => a.map((x) => x.id === id ? { ...x, status: 'Resolved' } : x));

  const acknowledgeCctv = (id) => setCctvEvents((e) => e.map((x) => x.id === id ? { ...x, acknowledged: true } : x));

  const createIncidentFromCctv = (ev) => {
    const inc = {
      id: nextId('INC'),
      ts: Date.now(),
      category: ev.type === 'smoke' ? 'Fire/Smoke' : ev.type === 'restricted' ? 'Restricted Area Violation' : ev.type === 'fall' ? 'Worker Safety' : 'Worker Safety',
      severity: ev.severity,
      zone: ZONES.find((z) => z.id === ev.zone)?.name || ev.zone,
      description: `${ev.label} detected on camera ${ev.cameraId} (${ev.cameraName}) at ${new Date(ev.ts).toLocaleTimeString()} with ${ev.confidence}% confidence.`,
      status: 'Open',
      assignee: '—',
    };
    setIncidents((s) => [inc, ...s]);
    acknowledgeCctv(ev.id);
    toast.success('Incident created', { description: `${inc.id} — ${inc.category}` });
    return inc;
  };

  const createIncident = (partial) => {
    const inc = { id: nextId('INC'), ts: Date.now(), status: 'Open', assignee: '—', severity: 'medium', category: 'Worker Safety', zone: 'Shaft A', description: '', ...partial };
    setIncidents((s) => [inc, ...s]);
    return inc;
  };
  const updateIncident = (id, patch) => setIncidents((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));

  const addViolation = (v) => setViolations((s) => [{ id: nextId('V'), detected: Date.now(), status: 'Open', officer: '—', ...v }, ...s]);
  const updateViolation = (id, patch) => setViolations((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));

  const addAction = (a) => setActions((s) => [{ id: nextId('CA'), stage: 'Assigned', priority: 'Medium', ...a }, ...s]);
  const updateAction = (id, patch) => setActions((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));

  const updateThreshold = (sensorId, patch) => setThresholds((t) => ({ ...t, [sensorId]: { ...t[sensorId], ...patch } }));

  // ---- Demo Mode: scripted 17-step methane hazard walkthrough ----
  const demoTimersRef = useRef([]);
  const clearDemoTimers = () => { demoTimersRef.current.forEach(clearTimeout); demoTimersRef.current = []; };

  const startDemo = useCallback(() => {
    clearDemoTimers();
    setDemoMode({ active: true, step: 0, paused: false });
    setSimMode('normal');
    const steps = [
      { delay: 800,   label: 'Baseline reading: mine SAFE', run: () => toast.info('Demo: Baseline established') },
      { delay: 2500,  label: 'Methane levels begin to rise', run: () => setSensors((s) => s.map((x) => x.type === 'methane' ? { ...x, value: 22 } : x)) },
      { delay: 4500,  label: 'Dust concentration climbing', run: () => setSensors((s) => s.map((x) => x.type === 'dust' ? { ...x, value: 5.5 } : x)) },
      { delay: 6500,  label: 'AI risk score entering WARNING', run: () => setSimMode('warning') },
      { delay: 8500,  label: 'Methane crosses WARNING threshold', run: () => setSensors((s) => s.map((x) => x.type === 'methane' ? { ...x, value: 32 } : x)) },
      { delay: 10500, label: 'CCTV: worker without helmet detected', run: () => {
        const cam = CAMERAS[3];
        setCctvEvents((e) => [{ id: nextId('DET'), ts: Date.now(), cameraId: cam.id, cameraName: cam.name, zone: cam.zone, type: 'helmet', label: 'Helmet Missing', severity: 'medium', confidence: 94, acknowledged: false }, ...e]);
      }},
      { delay: 12500, label: 'Temperature rising in Shaft A', run: () => setSensors((s) => s.map((x) => x.type === 'temperature' ? { ...x, value: 41 } : x)) },
      { delay: 14500, label: 'Methane enters CRITICAL range', run: () => { setSimMode('critical'); setSensors((s) => s.map((x) => x.type === 'methane' ? { ...x, value: 48 } : x)); }},
      { delay: 16500, label: 'CO gas rising', run: () => setSensors((s) => s.map((x) => x.type === 'co' ? { ...x, value: 32 } : x)) },
      { delay: 18500, label: 'CCTV: unsafe worker–machine proximity', run: () => {
        const cam = CAMERAS[2];
        setCctvEvents((e) => [{ id: nextId('DET'), ts: Date.now(), cameraId: cam.id, cameraName: cam.name, zone: cam.zone, type: 'proximity', label: 'Unsafe Worker–Machine Proximity', severity: 'high', confidence: 89, acknowledged: false }, ...e]);
      }},
      { delay: 20500, label: 'Critical alert broadcast', run: () => toast.error('CRITICAL ALERT', { description: 'Methane concentration above safe threshold in Shaft B.' }) },
      { delay: 22500, label: 'Incident auto-created', run: () => {
        const inc = createIncident({ category: 'Gas Hazard', severity: 'critical', zone: 'Shaft B', description: 'Methane concentration critical in Shaft B — evacuation recommended.' });
        addViolation({ type: 'Methane Threshold Exceeded', zone: 'shaft-b', severity: 'critical', status: 'Investigating', officer: 'Rohan Verma' });
        return inc;
      }},
      { delay: 24500, label: 'Corrective action assigned', run: () => addAction({ violationId: 'V-DEMO', description: 'Activate ventilation boost, evacuate Shaft B non-essentials, verify methane sensors.', assignee: 'Rohan Verma', deadline: Date.now() + 3600e3 * 4, priority: 'Critical', stage: 'Investigation' }) },
      { delay: 26500, label: 'Emergency Mode engaged', run: () => setEmergency(true) },
      { delay: 29500, label: 'Ventilation boost taking effect', run: () => setSensors((s) => s.map((x) => x.type === 'methane' ? { ...x, value: 30 } : x.type === 'co' ? { ...x, value: 18 } : x)) },
      { delay: 32500, label: 'Zone returning to SAFE', run: () => { setSimMode('normal'); setSensors((s) => s.map((x) => x.type === 'methane' ? { ...x, value: 14 } : x.type === 'dust' ? { ...x, value: 3.4 } : x.type === 'temperature' ? { ...x, value: 29 } : x.type === 'co' ? { ...x, value: 9 } : x)); }},
      { delay: 34500, label: 'Compliance score updated post-resolution', run: () => { setEmergency(false); toast.success('Demo complete', { description: 'Incident resolved. Compliance re-evaluated.' }); setDemoMode({ active: false, step: 17, paused: false }); }},
    ];
    steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setDemoMode((d) => d.active ? { ...d, step: idx + 1 } : d);
        step.run();
      }, step.delay);
      demoTimersRef.current.push(t);
    });
  }, []);

  const pauseDemo = () => { clearDemoTimers(); setDemoMode((d) => ({ ...d, paused: true })); };
  const resetDemo = () => { clearDemoTimers(); setDemoMode({ active: false, step: 0, paused: false }); setSimMode('normal'); setEmergency(false); setSensors(initialSensors()); toast('Demo reset'); };

  useEffect(() => () => clearDemoTimers(), []);

  // KPI derived counts
  const criticalIncidents = incidents.filter((i) => i.severity === 'critical' && i.status !== 'Resolved').length;
  const activeAlertCount = activeUnackAlerts.length;
  const overallSafety = Math.max(0, 100 - risk.score);
  const workersPresent = ZONES.reduce((a, z) => a + z.workers, 0);
  const connectedSensors = { active: sensors.length, total: 100 };

  const value = {
    // core
    user, setUser, login, logout,
    activeMine, setActiveMine, mines: MINES, zones: ZONES,
    // simulation
    simMode, setSimMode, emergency, setEmergency,
    demoMode, startDemo, pauseDemo, resetDemo,
    // data
    sensors: sensorsWithThresholds, thresholds, updateThreshold,
    alerts, acknowledgeAlert, assignAlert, resolveAlert,
    cctvEvents, acknowledgeCctv, createIncidentFromCctv,
    incidents, createIncident, updateIncident,
    violations, addViolation, updateViolation,
    actions, addAction, updateAction,
    cameras: CAMERAS,
    // derived
    risk, complianceCategories, complianceScore,
    riskHistory, sensorHistory, complianceHistory,
    kpi: { overallSafety, complianceScore, activeAlertCount, criticalIncidents, workersPresent, connectedSensors },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
