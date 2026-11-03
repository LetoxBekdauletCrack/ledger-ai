'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

interface ChartsProps {
  isLoading: boolean;
  trends: { month: string; income: number; expense: number }[];
  categoryBreakdown: { category: string; amount: number; percentage: number; color: string }[];
}

export function ChartsSection({ isLoading, trends, categoryBreakdown }: ChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/40 p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-72 w-full" />
        </Card>
        <Card className="border-slate-800 bg-slate-900/40 p-6">
          <Skeleton className="h-6 w-36 mb-4" />
          <Skeleton className="h-72 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="analytics">
      {/* Cash Flow Trends Chart */}
      <Card className="lg:col-span-2 border-slate-800/90 bg-slate-900/60 shadow-xl" data-testid="cash-flow-chart">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base text-white">Cash Flow Dynamics</CardTitle>
            <p className="text-xs text-slate-400">Monthly comparison of total inflow vs outflow</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Inflow
            </span>
            <span className="flex items-center gap-1.5 text-pink-400">
              <span className="h-2 w-2 rounded-full bg-pink-400" /> Outflow
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val: number) => [formatCurrency(val), '']}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                  name="Inflow"
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                  name="Outflow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Allocation Donut */}
      <Card className="border-slate-800/90 bg-slate-900/60 shadow-xl" data-testid="category-breakdown-chart">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-white">Expense Distribution</CardTitle>
          <p className="text-xs text-slate-400">Breakdown by category expenditure</p>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56 w-full flex items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {categoryBreakdown.map((entry) => (
                      <Cell key={`cell-${entry.category}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      border: '1px solid #1e293b',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#fff',
                    }}
                    formatter={(val: number, name: string, props: any) => [
                      formatCurrency(val),
                      `${props.payload.category} (${props.payload.percentage}%)`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-500">No expense records logged</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-24 overflow-y-auto pr-1">
            {categoryBreakdown.slice(0, 6).map((cat) => (
              <div key={cat.category} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate text-slate-300">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="truncate">{cat.category}</span>
                </span>
                <span className="font-semibold text-slate-400">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

