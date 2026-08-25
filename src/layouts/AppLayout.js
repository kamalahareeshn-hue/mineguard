import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Activity, Camera, Cpu, ShieldAlert, ClipboardCheck, AlertOctagon, Wrench, FileText, LineChart, Settings, Shield, LogOut, Bell, Siren, ChevronDown, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../components/ui/dropdown-menu';

const NAV = [
  { to: '/app/dashboard',   label: 'Dashboard',          icon: LayoutDashboard, testid: 'nav-dashboard' },
  { to: '/app/live',        label: 'Live Monitoring',    icon: Activity,        testid: 'nav-live' },
  { to: '/app/cctv',        label: 'CCTV & AI Vision',   icon: Camera,          testid: 'nav-cctv' },
  { to: '/app/sensors',     label: 'Sensors',            icon: Cpu,             testid: 'nav-sensors' },
  { to: '/app/alerts',      label: 'Risk & Alerts',      icon: ShieldAlert,     testid: 'nav-alerts' },
  { to: '/app/compliance',  label: 'Compliance',         icon: ClipboardCheck,  testid: 'nav-compliance' },
  { to: '/app/incidents',   label: 'Incidents',          icon: AlertOctagon,    testid: 'nav-incidents' },
  { to: '/app/actions',     label: 'Corrective Actions', icon: Wrench,          testid: 'nav-actions' },
  { to: '/app/reports',     label: 'Reports',            icon: FileText,        testid: 'nav-reports' },
  { to: '/app/analytics',   label: 'Analytics',          icon: LineChart,       testid: 'nav-analytics' },
  { to: '/app/settings',    label: 'Settings',           icon: Settings,        testid: 'nav-settings' },
];

const Sidebar = ({ open, onClose }) => (
  <>
    {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}
    <aside className={`fixed lg:sticky top-0 z-50 lg:z-auto h-screen w-64 bg-[#0B0D11] border-r border-white/10 shrink-0 flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} data-testid="sidebar">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
          <Shield size={18} strokeWidth={2} className="text-white" />
        </div>
        <div>
          <div className="font-heading font-bold text-[15px] leading-none">MineGuard AI</div>
          <div className="text-[10px] tracking-[0.18em] text-zinc-500 mt-1">SENSE · ANALYZE · PROTECT</div>
        </div>
        <button className="ml-auto lg:hidden text-zinc-400" onClick={onClose}><X size={18} /></button>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            data-testid={n.testid}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm mb-0.5 transition-colors duration-200 ${
                isActive ? 'bg-white/10 text-white border-l-2 border-blue-500 pl-[10px]' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <n.icon size={16} strokeWidth={1.5} />
            <span className="font-medium">{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 text-[10px] text-zinc-500 leading-relaxed">
        Demo system for intelligent monitoring &amp; decision support. Real-world deployment requires certified sensors, validated AI models &amp; regulatory approval.
      </div>
    </aside>
  </>
);

const Header = ({ onToggleSidebar }) => {
  const { user, logout, activeMine, setActiveMine, mines, emergency, setEmergency, alerts } = useApp();
  const navigate = useNavigate();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [now, setNow] = useState('');
  React.useEffect(() => {
    setNow(new Date().toLocaleString());
    const iv = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(iv);
  }, []);
  const unread = alerts.filter((a) => a.status === 'Active').length;
  const activeMineObj = mines.find((m) => m.id === activeMine);

  const handleEmergencyToggle = () => {
    setEmergency(!emergency);
    setEmergencyOpen(false);
  };

  return (
    <header className={`sticky top-0 z-30 h-16 border-b border-white/10 flex items-center gap-3 px-4 lg:px-6 ${emergency ? 'bg-gradient-to-r from-red-950 via-red-900 to-red-950' : 'bg-[#090A0C]'}`} data-testid="app-header">
      <button className="lg:hidden text-zinc-400" onClick={onToggleSidebar} data-testid="btn-sidebar-toggle">
        <LayoutDashboard size={20} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/10 hover:border-white/20 text-sm" data-testid="mine-selector">
            <span className="text-zinc-500 text-xs">Mine</span>
            <span className="font-medium">{activeMineObj?.name}</span>
            <ChevronDown size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#121418] border-white/10 text-white">
          <DropdownMenuLabel>Select Mine</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          {mines.map((m) => (
            <DropdownMenuItem key={m.id} onClick={() => setActiveMine(m.id)} data-testid={`mine-option-${m.id}`}>
              {m.name} <span className="ml-2 text-xs text-zinc-500">{m.region}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden md:flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-dot"></span>
          SYSTEM ONLINE
        </span>
        <span className="text-zinc-500 font-mono-data">{now}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2 rounded-sm hover:bg-white/5" data-testid="btn-notifications" onClick={() => navigate('/app/alerts')}>
          <Bell size={18} strokeWidth={1.6} className="text-zinc-300" />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">{unread}</span>}
        </button>

        <Button
          onClick={() => setEmergencyOpen(true)}
          className={`rounded-sm h-9 gap-2 ${emergency ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600/90 hover:bg-red-600 text-white'} border border-red-400/30`}
          data-testid="btn-emergency"
        >
          <Siren size={16} />
          {emergency ? 'EMERGENCY ACTIVE' : 'EMERGENCY MODE'}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded-sm hover:bg-white/5" data-testid="btn-user-menu">
              <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center font-heading font-semibold text-sm">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium leading-none">{user?.name}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{user?.role}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#121418] border-white/10 text-white">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={() => { logout(); navigate('/'); }} data-testid="btn-logout">
              <LogOut size={14} className="mr-2" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="bg-[#121418] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="font-heading">{emergency ? 'Deactivate Emergency Mode?' : 'Activate Emergency Mode?'}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {emergency
                ? 'This will return the platform to normal monitoring state.'
                : 'This will broadcast a simulated emergency signal, highlight critical zones and stage evacuation instructions. Demo only — no real emergency services are contacted.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" className="hover:bg-white/10" onClick={() => setEmergencyOpen(false)} data-testid="btn-emergency-cancel">Cancel</Button>
            <Button onClick={handleEmergencyToggle} className={emergency ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} data-testid="btn-emergency-confirm">
              {emergency ? 'Deactivate' : 'Activate Emergency'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default function AppLayout() {
  const { emergency } = useApp();
  const [sbOpen, setSbOpen] = useState(false);
  return (
    <div className={`min-h-screen flex bg-[#090A0C] noise-bg ${emergency ? 'emergency-active' : ''}`}>
      <Sidebar open={sbOpen} onClose={() => setSbOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSbOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
