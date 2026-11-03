'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '#transactions', icon: ArrowLeftRight },
  { name: 'Analytics', href: '#analytics', icon: PieChart },
  { name: 'Budgets', href: '#budgets', icon: Target },
];

export function Sidebar({ user, onLogout }: { user?: { name: string; email: string }; onLogout?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/90 flex flex-col justify-between p-4 shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              Ledger<span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-wide uppercase font-medium">B2C Finance Engine</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* AI Features badge */}
        <div className="mt-8 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
          <div className="flex items-center gap-2 mb-1.5 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>AI Anomaly Guard</span>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed">
            Real-time heuristic scans on charges exceeding 2.5x variance threshold.
          </p>
        </div>
      </div>

      {/* User profile footer */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{user?.name || 'Alex Morgan'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || 'demo@ledgerai.com'}</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Logout"
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-md hover:bg-slate-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

