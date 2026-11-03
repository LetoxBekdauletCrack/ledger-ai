'use client';

import React from 'react';
import { Target, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export interface BudgetRecord {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
}

interface BudgetProps {
  isLoading: boolean;
  budgets: BudgetRecord[];
}

export function BudgetProgress({ isLoading, budgets }: BudgetProps) {
  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-900/40 p-6" id="budgets">
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800/90 bg-slate-900/60 shadow-xl" id="budgets" data-testid="budgets-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Category Budget Targets
            </CardTitle>
            <p className="text-xs text-slate-400">Real-time expenditure vs monthly caps</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgets.map((b) => {
            const percentage = Math.min(Math.round((b.spent / b.monthlyLimit) * 100), 150);
            const isOver = b.spent > b.monthlyLimit;
            const isWarning = percentage >= 80 && !isOver;

            let barColor = 'bg-emerald-500';
            if (isOver) barColor = 'bg-red-500';
            else if (isWarning) barColor = 'bg-amber-500';

            return (
              <div
                key={b.id || b.category}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">{b.category}</span>
                  {isOver && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-500/30">
                      <AlertCircle className="h-3 w-3" /> Exceeded
                    </span>
                  )}
                  {isWarning && (
                    <span className="text-[10px] text-amber-400 font-medium bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                      80%+ Warning
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{formatCurrency(b.spent)}</span>
                    <span className="text-slate-500 font-mono">/ {formatCurrency(b.monthlyLimit)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  {percentage}% utilized
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

