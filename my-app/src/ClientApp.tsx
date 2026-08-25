"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#090A0C] text-white flex flex-col items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-500 to-emerald-500 animate-pulse flex items-center justify-center">
          <span className="font-bold text-white text-sm">MG</span>
        </div>
        <div className="font-heading font-bold text-xl tracking-tight">MineGuard AI</div>
      </div>
      <div className="text-xs text-zinc-500 mt-2 font-mono-data">Loading Command Center...</div>
    </div>
  ),
});

export default function ClientApp() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090A0C] text-white flex flex-col items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-blue-500 to-emerald-500 animate-pulse flex items-center justify-center">
            <span className="font-bold text-white text-sm">MG</span>
          </div>
          <div className="font-heading font-bold text-xl tracking-tight">MineGuard AI</div>
        </div>
        <div className="text-xs text-zinc-500 mt-2 font-mono-data">Initializing System...</div>
      </div>
    );
  }

  return <App />;
}
