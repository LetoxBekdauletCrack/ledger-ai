'use client';

import React from 'react';
import { Sparkles, Plus, Calendar, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onOpenAddModal: () => void;
  anomalyCount?: number;
}

export function Header({ onOpenAddModal, anomalyCount = 0 }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Fintech Analytics Dashboard</h2>
        <div className="flex items-center gap-2 mt-0.5">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">{currentDate}</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Live Engine Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {anomalyCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold">
            <Bell className="h-3.5 w-3.5 text-red-400 animate-bounce" />
            <span>{anomalyCount} Anomalies Flagged</span>
          </div>
        )}
        <Button
          onClick={onOpenAddModal}
          data-testid="add-transaction-btn"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </header>
  );
}

