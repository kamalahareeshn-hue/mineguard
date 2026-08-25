// Centralized mock/seed data for MineGuard AI simulation

export const MINES = [
  { id: 'jharia-01', name: 'Jharia Coalfield - Block A', region: 'Jharkhand' },
  { id: 'raniganj-02', name: 'Raniganj Coalfield - Block C', region: 'West Bengal' },
  { id: 'korba-03', name: 'Korba Coalfield - South Pit', region: 'Chhattisgarh' },
];

export const ZONES = [
  { id: 'shaft-a', name: 'Shaft A', workers: 42 },
  { id: 'shaft-b', name: 'Shaft B', workers: 58 },
  { id: 'conveyor', name: 'Conveyor Area', workers: 24 },
  { id: 'excavation', name: 'Excavation Zone', workers: 61 },
  { id: 'processing', name: 'Processing Area', workers: 33 },
  { id: 'storage', name: 'Storage Area', workers: 18 },
  { id: 'restricted', name: 'Restricted Zone', workers: 12 },
];

export const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Ananya Reddy', role: 'Admin' },
  { username: 'safety', password: 'safety123', name: 'Rohan Verma', role: 'Safety Officer' },
  { username: 'env', password: 'env123', name: 'Priya Nair', role: 'Environmental Officer' },
  { username: 'manager', password: 'manager123', name: 'Vikram Iyer', role: 'Mine Manager' },
];

// Sensor definitions with realistic ranges & thresholds (methane in %LEL, dust in mg/m3 etc.)
export const SENSOR_SEED = [
  { id: 'S-M04', type: 'methane',     label: 'Methane (CH₄)',     unit: '%LEL',  zone: 'shaft-b',    base: 12, min: 0,  max: 100, warn: 25, crit: 45 },
  { id: 'S-D02', type: 'dust',        label: 'Dust Concentration', unit: 'mg/m³', zone: 'excavation', base: 3.2, min: 0,  max: 25,  warn: 6,  crit: 10 },
  { id: 'S-T01', type: 'temperature', label: 'Temperature',        unit: '°C',    zone: 'shaft-a',    base: 28, min: 10, max: 60,  warn: 38, crit: 45 },
  { id: 'S-C03', type: 'co',          label: 'Carbon Monoxide',    unit: 'ppm',   zone: 'shaft-b',    base: 8,  min: 0,  max: 200, warn: 25, crit: 50 },
  { id: 'S-N05', type: 'noise',       label: 'Noise Level',        unit: 'dB',    zone: 'processing', base: 72, min: 40, max: 130, warn: 85, crit: 100 },
  { id: 'S-W06', type: 'water',       label: 'Water Quality (pH)', unit: 'pH',    zone: 'processing', base: 7.1, min: 3,  max: 11,  warn: 8.5, crit: 9.5 },
  { id: 'S-A07', type: 'air',         label: 'Air Quality (AQI)',  unit: 'AQI',   zone: 'conveyor',   base: 88, min: 20, max: 400, warn: 150, crit: 250 },
  { id: 'S-V08', type: 'vibration',   label: 'Equipment Vibration', unit: 'mm/s', zone: 'excavation', base: 4.1, min: 0,  max: 40,  warn: 10, crit: 18 },
];

export const CAMERAS = [
  { id: 'C-01', name: 'Mine Entrance', zone: 'shaft-a', img: 'https://images.unsplash.com/photo-1623438804534-24e41bdc5ac2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxjb2FsJTIwbWluZSUyMHdvcmtlcnxlbnwwfHx8fDE3ODc1NjczNDV8MA&ixlib=rb-4.1.0&q=85' },
  { id: 'C-02', name: 'Shaft B Descent', zone: 'shaft-b', img: 'https://images.unsplash.com/photo-1720381297922-c98b246c9ebc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxjb2FsJTIwbWluZSUyMHdvcmtlcnxlbnwwfHx8fDE3ODc1NjczNDV8MA&ixlib=rb-4.1.0&q=85' },
  { id: 'C-03', name: 'Conveyor Line', zone: 'conveyor', img: 'https://images.unsplash.com/photo-1618482914248-29272d021005?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMGNjdHZ8ZW58MHx8fHwxNzg3NTY3MzQ1fDA&ixlib=rb-4.1.0&q=85' },
  { id: 'C-04', name: 'Excavation Face', zone: 'excavation', img: 'https://images.unsplash.com/photo-1623438804534-24e41bdc5ac2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxjb2FsJTIwbWluZSUyMHdvcmtlcnxlbnwwfHx8fDE3ODc1NjczNDV8MA&ixlib=rb-4.1.0&q=85' },
  { id: 'C-05', name: 'Restricted Perimeter', zone: 'restricted', img: 'https://images.unsplash.com/photo-1618482914248-29272d021005?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxpbmR1c3RyaWFsJTIwZmFjdG9yeSUyMGNjdHZ8ZW58MHx8fHwxNzg3NTY3MzQ1fDA&ixlib=rb-4.1.0&q=85' },
  { id: 'C-06', name: 'Equipment Bay', zone: 'processing', img: 'https://images.unsplash.com/photo-1720381297922-c98b246c9ebc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHw0fHxjb2FsJTIwbWluZSUyMHdvcmtlcnxlbnwwfHx8fDE3ODc1NjczNDV8MA&ixlib=rb-4.1.0&q=85' },
];

export const AI_DETECTION_TYPES = [
  { key: 'helmet',      label: 'Helmet Missing',              severity: 'medium' },
  { key: 'restricted',  label: 'Worker in Restricted Area',   severity: 'high' },
  { key: 'proximity',   label: 'Unsafe Worker–Machine Proximity', severity: 'high' },
  { key: 'smoke',       label: 'Smoke / Fire Detection',      severity: 'critical' },
  { key: 'fall',        label: 'Worker Fall Detected',        severity: 'critical' },
  { key: 'crowd',       label: 'Worker Concentration Anomaly', severity: 'medium' },
  { key: 'unusual',     label: 'Unusual Activity Pattern',    severity: 'low' },
];

export const COMPLIANCE_CATEGORIES = [
  { id: 'worker',   label: 'Worker Safety',            base: 91 },
  { id: 'env',      label: 'Environmental Compliance', base: 84 },
  { id: 'equip',    label: 'Equipment Safety',         base: 89 },
  { id: 'air',      label: 'Air Quality',              base: 82 },
  { id: 'water',    label: 'Water Quality',            base: 93 },
  { id: 'waste',    label: 'Waste Management',         base: 88 },
  { id: 'regdoc',   label: 'Regulatory Documentation', base: 90 },
];

export const SEED_VIOLATIONS = [
  { id: 'V-2041', type: 'PPE Violation',          zone: 'excavation', severity: 'medium', detected: Date.now() - 3600e3 * 6, status: 'Corrective Action', officer: 'Rohan Verma' },
  { id: 'V-2038', type: 'Restricted Area Entry',  zone: 'restricted', severity: 'high',   detected: Date.now() - 3600e3 * 14, status: 'Investigating',     officer: 'Rohan Verma' },
  { id: 'V-2029', type: 'Dust Threshold Exceeded', zone: 'processing', severity: 'medium', detected: Date.now() - 3600e3 * 28, status: 'Resolved',          officer: 'Priya Nair' },
];

export const SEED_ACTIONS = [
  { id: 'CA-501', violationId: 'V-2041', description: 'Enforce helmet check-in at excavation gate; reissue PPE briefing.', assignee: 'Rohan Verma', deadline: Date.now() + 86400e3 * 2, priority: 'High', stage: 'Corrective Action' },
  { id: 'CA-500', violationId: 'V-2038', description: 'Install additional signage & QR-based access log at Restricted Zone.', assignee: 'Vikram Iyer', deadline: Date.now() + 86400e3 * 5, priority: 'Medium', stage: 'Investigation' },
];
