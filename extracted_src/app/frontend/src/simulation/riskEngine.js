// Simulated AI risk engine. Deterministic-ish calculation with human-readable factors.

export const statusFromSensor = (s) => {
  if (s.value >= s.crit) return 'critical';
  if (s.value >= s.warn) return 'warning';
  return 'safe';
};

// Weight each sensor's contribution then blend with CCTV/incident/violation load.
export function computeRisk({ sensors, activeAlerts = [], openIncidents = 0, cctvEventsLastMin = 0 }) {
  const factors = [];
  let score = 8; // baseline

  sensors.forEach((s) => {
    const status = statusFromSensor(s);
    if (status === 'critical') {
      const delta = 22 + Math.min(18, ((s.value - s.crit) / Math.max(1, s.crit)) * 30);
      score += delta;
      factors.push({ label: `${s.label} in CRITICAL range (${s.value.toFixed(1)} ${s.unit})`, weight: Math.round(delta) });
    } else if (status === 'warning') {
      const delta = 8 + Math.min(10, ((s.value - s.warn) / Math.max(1, s.warn)) * 15);
      score += delta;
      factors.push({ label: `${s.label} above warning threshold (${s.value.toFixed(1)} ${s.unit})`, weight: Math.round(delta) });
    }
  });

  if (cctvEventsLastMin > 0) {
    const delta = Math.min(15, cctvEventsLastMin * 4);
    score += delta;
    factors.push({ label: `${cctvEventsLastMin} CCTV AI detection${cctvEventsLastMin > 1 ? 's' : ''} in the last minute`, weight: delta });
  }

  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical').length;
  if (criticalAlerts > 0) {
    score += criticalAlerts * 6;
    factors.push({ label: `${criticalAlerts} unacknowledged critical alert${criticalAlerts > 1 ? 's' : ''}`, weight: criticalAlerts * 6 });
  }

  if (openIncidents > 0) {
    score += Math.min(10, openIncidents * 3);
    factors.push({ label: `${openIncidents} open incident${openIncidents > 1 ? 's' : ''} in progress`, weight: Math.min(10, openIncidents * 3) });
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let category = 'LOW';
  let recommendation = 'Continue routine monitoring. No immediate action required.';
  if (score >= 90) {
    category = 'CRITICAL';
    recommendation = 'Evacuate affected zone immediately. Trigger emergency response and inspect ventilation & gas systems.';
  } else if (score >= 70) {
    category = 'HIGH';
    recommendation = 'Restrict access to affected zones. Dispatch safety officer & verify sensor calibration.';
  } else if (score >= 40) {
    category = 'MEDIUM';
    recommendation = 'Increase monitoring frequency, brief on-site supervisors and prepare mitigation plans.';
  }

  factors.sort((a, b) => b.weight - a.weight);
  return { score, category, factors: factors.slice(0, 5), recommendation };
}

export const riskColor = (category) => {
  switch (category) {
    case 'CRITICAL': return { text: 'text-red-400', bg: 'bg-red-500/10', ring: 'ring-red-500/40', border: 'border-red-500/40' };
    case 'HIGH':     return { text: 'text-orange-400', bg: 'bg-orange-500/10', ring: 'ring-orange-500/40', border: 'border-orange-500/40' };
    case 'MEDIUM':   return { text: 'text-amber-400', bg: 'bg-amber-500/10', ring: 'ring-amber-500/40', border: 'border-amber-500/40' };
    default:         return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/40', border: 'border-emerald-500/40' };
  }
};

export const statusColor = (status) => {
  switch (status) {
    case 'critical': return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'CRITICAL' };
    case 'warning':  return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'WARNING' };
    default:         return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'SAFE' };
  }
};
