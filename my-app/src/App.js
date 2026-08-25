import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from './components/ui/sonner';

import AppLayout from './layouts/AppLayout';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import LiveMonitoring from './views/LiveMonitoring';
import CCTV from './views/CCTV';
import Sensors from './views/Sensors';
import AlertsPage from './views/AlertsPage';
import Compliance from './views/Compliance';
import Incidents from './views/Incidents';
import CorrectiveActions from './views/CorrectiveActions';
import Reports from './views/Reports';
import Analytics from './views/Analytics';
import Settings from './views/Settings';

function Protected({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<Protected><AppLayout /></Protected>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="live" element={<LiveMonitoring />} />
        <Route path="cctv" element={<CCTV />} />
        <Route path="sensors" element={<Sensors />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="actions" element={<CorrectiveActions />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="App">
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster theme="dark" position="top-right" richColors closeButton />
      </AppProvider>
    </div>
  );
}
