import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Play, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const DEMO_CREDS = [
  { role: 'Admin', u: 'admin', p: 'admin123' },
  { role: 'Safety Officer', u: 'safety', p: 'safety123' },
  { role: 'Environmental Officer', u: 'env', p: 'env123' },
  { role: 'Mine Manager', u: 'manager', p: 'manager123' },
];

export default function Login() {
  const { user, login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (user) return <Navigate to="/app/dashboard" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (login(username.trim(), password)) {
      toast.success('Login successful', { description: 'Welcome to DeepShield AI' });
      navigate('/app/dashboard');
    } else {
      toast.error('Invalid credentials', { description: 'Use any demo account shown on this page.' });
    }
  };

  const enterDemo = () => {
    login('admin', 'admin123');
    toast('Entering demo mode', { description: 'Logged in as Admin — full access.' });
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#090A0C] noise-bg text-white grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1768280511074-3b3effe7a139?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHxkYXJrJTIwYWJzdHJhY3QlMjB0b3BvZ3JhcGhpYyUyMG1hcHxlbnwwfHx8fDE3ODc1NjczNDV8MA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#090A0C]/60 via-[#090A0C]/85 to-[#090A0C]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-sm bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <div className="font-heading font-bold text-2xl leading-tight">DeepShield AI</div>
            <div className="text-[11px] tracking-[0.22em] text-zinc-400">SENSE · ANALYZE · PROTECT</div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="font-heading font-bold text-4xl leading-tight mb-4">
            AI-Powered Smart Governance &amp; Compliance Monitoring
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Real-time IoT sensor telemetry, CCTV computer-vision safety detection, an explainable risk engine and
            automated compliance reporting — unified in one command center built for modern coal mines.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[{ k: 'Sensors', v: '96/100' }, { k: 'AI Score', v: '92%' }, { k: 'Compliance', v: '87%' }].map((s) => (
              <div key={s.k} className="border border-white/10 bg-[#121418]/70 backdrop-blur-sm rounded-sm p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{s.k}</div>
                <div className="mt-1 font-mono-data text-lg font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-[10px] text-zinc-500 max-w-md">
          Demo system for intelligent monitoring and decision support. Real-world deployment requires certified sensors, validated AI models, regulatory approval and safety procedures.
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="font-heading font-bold text-lg leading-none">DeepShield AI</div>
              <div className="text-[10px] tracking-[0.22em] text-zinc-400 mt-1">SENSE · ANALYZE · PROTECT</div>
            </div>
          </div>

          <h2 className="font-heading font-bold text-2xl">Access the Command Center</h2>
          <p className="text-sm text-zinc-500 mt-1">Sign in with any demo account below.</p>

          <form onSubmit={submit} className="mt-6 space-y-4" data-testid="login-form">
            <div>
              <Label className="text-xs uppercase tracking-[0.15em] text-zinc-400">Username</Label>
              <Input
                data-testid="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5 bg-[#121418] border-white/10 rounded-sm focus-visible:ring-blue-500 text-white"
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-[0.15em] text-zinc-400">Password</Label>
              <Input
                data-testid="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="mt-1.5 bg-[#121418] border-white/10 rounded-sm focus-visible:ring-blue-500 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 rounded-sm bg-blue-600 hover:bg-blue-700 gap-2" data-testid="btn-login">
                <LogIn size={16} /> Sign in
              </Button>
              <Button type="button" onClick={enterDemo} className="rounded-sm bg-emerald-600 hover:bg-emerald-700 gap-2" data-testid="btn-enter-demo">
                <Play size={16} /> Enter Demo Mode
              </Button>
            </div>
          </form>

          <div className="mt-8 border border-white/10 rounded-sm p-4 bg-[#121418]">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 mb-2">Demo Accounts</div>
            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              {DEMO_CREDS.map((d) => (
                <button
                  key={d.u}
                  type="button"
                  onClick={() => { setUsername(d.u); setPassword(d.p); }}
                  className="text-left border border-white/10 rounded-sm p-2 hover:border-white/25 hover:bg-white/5 transition-colors duration-200"
                  data-testid={`demo-cred-${d.u}`}
                >
                  <div className="font-medium">{d.role}</div>
                  <div className="text-zinc-500 font-mono-data">{d.u} / {d.p}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
