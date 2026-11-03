'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Trash2, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CATEGORY_COLORS } from '../../../mock-service';

export interface TransactionItem {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  merchant: string;
  description?: string;
  date: string;
  status: string;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

interface TableProps {
  isLoading: boolean;
  transactions: TransactionItem[];
  onDeleteTransaction: (id: string) => void;
  onFilterChange: (filters: { search: string; category: string; type: string }) => void;
}

const CATEGORIES = [
  'ALL',
  'Salary',
  'Investments',
  'Housing',
  'Groceries',
  'Dining',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Miscellaneous',
];

export function TransactionTable({
  isLoading,
  transactions,
  onDeleteTransaction,
  onFilterChange,
}: TableProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const handleSearchChange = (val: string) => {
    setSearch(val);
    onFilterChange({ search: val, category: selectedCategory, type: selectedType });
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    onFilterChange({ search, category: val, type: selectedType });
  };

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    onFilterChange({ search, category: selectedCategory, type: val });
  };

  return (
    <Card className="border-slate-800/90 bg-slate-900/60 shadow-xl" id="transactions">
      <CardHeader className="p-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base text-white flex items-center gap-2">
              Recent Transactions
              <span className="text-xs font-normal text-slate-400">
                ({transactions.length} records)
              </span>
            </CardTitle>
            <p className="text-xs text-slate-400">Ledger entries with real-time anomaly detection</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search merchant..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-950/80 border-slate-700"
                data-testid="transaction-search-input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-700 bg-slate-950/80 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary"
              data-testid="category-filter-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <div className="flex rounded-lg border border-slate-700 bg-slate-950/80 p-0.5 text-xs">
              <button
                onClick={() => handleTypeChange('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedType === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleTypeChange('INCOME')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedType === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Inflow
              </button>
              <button
                onClick={() => handleTypeChange('EXPENSE')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedType === 'EXPENSE' ? 'bg-pink-500/20 text-pink-400 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Outflow
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" data-testid="transactions-table">
            <thead className="bg-slate-950/60 border-y border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Merchant & Description</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6 text-right">Amount</th>
                <th className="py-3 px-6 text-center">Status & Alerts</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i}>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-36 mb-1" /><Skeleton className="h-3 w-24" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-12" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    <td className="py-4 px-6"><Skeleton className="h-4 w-16 mx-auto" /></td>
                    <td className="py-4 px-6 text-right"><Skeleton className="h-6 w-6 ml-auto" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-sm">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      tx.isAnomaly ? 'bg-red-950/10' : ''
                    }`}
                    data-testid="transaction-row"
                  >
                    <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-400">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-white text-sm">{tx.merchant}</div>
                      {tx.description && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">{tx.description}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[tx.category] || '#94A3B8'}18`,
                          borderColor: `${CATEGORY_COLORS[tx.category] || '#94A3B8'}40`,
                          color: CATEGORY_COLORS[tx.category] || '#94A3B8',
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[tx.category] || '#94A3B8' }}
                        />
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        {tx.type === 'INCOME' ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right whitespace-nowrap font-mono font-medium">
                      <span
                        className={
                          tx.type === 'INCOME'
                            ? 'text-emerald-400'
                            : tx.isAnomaly
                            ? 'text-red-400 font-bold'
                            : 'text-white'
                        }
                      >
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center whitespace-nowrap">
                      {tx.isAnomaly ? (
                        <span
                          title={tx.anomalyReason}
                          className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded-md cursor-help"
                          data-testid="anomaly-pill"
                        >
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                          Anomaly
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">
                          {tx.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-md hover:bg-slate-800 transition-colors"
                        title="Delete transaction"
                        data-testid="delete-tx-btn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

