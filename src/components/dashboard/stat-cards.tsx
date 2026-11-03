'use client';

import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface StatCardsProps {
  isLoading: boolean;
  totalBalance: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  netSavingsRate: number;
  anomalyCount: number;
}

export function StatCards({
  isLoading,
  totalBalance,
  monthlyInflow,
  monthlyOutflow,
  netSavingsRate,
  anomalyCount,
}: StatCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4 border-slate-800 bg-slate-900/40">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Balance',
      value: formatCurrency(totalBalance),
      subtext: 'Net accumulated liquid balance',
      icon: Wallet,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
      testId: 'stat-total-balance',
    },
    {
      title: 'Monthly Inflow',
      value: formatCurrency(monthlyInflow),
      subtext: 'Payroll & dividends',
      icon: ArrowUpRight,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20',
      testId: 'stat-monthly-inflow',
    },
    {
      title: 'Monthly Outflow',
      value: formatCurrency(monthlyOutflow),
      subtext: 'Discretionary & fixed spend',
      icon: ArrowDownRight,
      color: 'text-pink-400',
      badgeBg: 'bg-pink-500/10 border-pink-500/20',
      testId: 'stat-monthly-outflow',
    },
    {
      title: 'Net Savings Rate',
      value: `${netSavingsRate}%`,
      subtext: netSavingsRate >= 20 ? 'Optimal savings trajectory' : 'Below 20% target',
      icon: Percent,
      color: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10 border-indigo-500/20',
      testId: 'stat-savings-rate',
    },
    {
      title: 'Anomalies Detected',
      value: anomalyCount.toString(),
      subtext: anomalyCount === 0 ? 'All transactions normal' : 'Requires user review',
      icon: AlertTriangle,
      color: anomalyCount > 0 ? 'text-amber-400' : 'text-slate-400',
      badgeBg: anomalyCount > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-slate-800/40 border-slate-700/30',
      testId: 'stat-anomalies',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            data-testid={card.testId}
            className="glow-card border-slate-800/90 bg-slate-900/60 p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.badgeBg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-white mb-1">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

