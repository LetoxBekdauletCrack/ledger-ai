'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { TransactionTable, TransactionItem } from '@/components/dashboard/transaction-table';
import { AddTransactionModal } from '@/components/dashboard/add-transaction-modal';
import { BudgetProgress, BudgetRecord } from '@/components/dashboard/budget-progress';
import { useToast } from '@/components/ui/toast-context';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: 'Alex Morgan',
    email: 'demo@ledgerai.com',
  });

  // Financial State
  const [analytics, setAnalytics] = useState({
    totalBalance: 0,
    monthlyInflow: 0,
    monthlyOutflow: 0,
    netSavingsRate: 0,
    anomalyCount: 0,
    recentTrends: [] as { month: string; income: number; expense: number }[],
    categoryBreakdown: [] as { category: string; amount: number; percentage: number; color: string }[],
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [budgets, setBudgets] = useState<BudgetRecord[]>([]);

  // Fetch summary metrics
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }, []);

  // Fetch transactions with optional filters
  const fetchTransactions = useCallback(async (filters?: { search?: string; category?: string; type?: string }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'ALL') params.set('category', filters.category);
      if (filters?.type && filters.type !== 'ALL') params.set('type', filters.type);
      if (filters?.search) params.set('search', filters.search);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  }, []);

  // Fetch budgets
  const fetchBudgets = useCallback(async () => {
    try {
      const res = await fetch('/api/budgets');
      if (res.ok) {
        const data = await res.json();
        setBudgets(data);
      }
    } catch (err) {
      console.error('Failed to load budgets:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Check local storage for user profile
    const storedUser = localStorage.getItem('ledger_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_) {}
    }

    Promise.all([fetchAnalytics(), fetchTransactions(), fetchBudgets()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchAnalytics, fetchTransactions, fetchBudgets]);

  // Create transaction handler
  const handleAddTransaction = async (data: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    merchant: string;
    description: string;
    date: string;
  }) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create transaction');
      }

      const newTx = await res.json();

      if (newTx.isAnomaly) {
        toast({
          title: 'Transaction Logged & Anomaly Detected!',
          description: `Flagged: ${newTx.anomalyReason || 'Amount exceeds typical variance'}`,
          type: 'warning',
        });
      } else {
        toast({
          title: 'Transaction Added',
          description: `Successfully recorded ${newTx.type === 'INCOME' ? '+' : '-'}$${newTx.amount.toFixed(2)} at ${newTx.merchant}`,
          type: 'success',
        });
      }

      // Revalidate
      fetchTransactions();
      fetchAnalytics();
      fetchBudgets();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Could not save transaction',
        type: 'error',
      });
      throw err;
    }
  };

  // Delete transaction handler
  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast({
          title: 'Transaction Deleted',
          description: 'Entry removed from ledger.',
          type: 'info',
        });
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        fetchAnalytics();
        fetchBudgets();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        type: 'error',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ledger_token');
    localStorage.removeItem('ledger_user');
    toast({
      title: 'Signed Out',
      description: 'You have been safely signed out.',
      type: 'info',
    });
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          anomalyCount={analytics.anomalyCount}
        />

        <main className="flex-1 p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Stat Cards */}
          <StatCards
            isLoading={isLoading}
            totalBalance={analytics.totalBalance}
            monthlyInflow={analytics.monthlyInflow}
            monthlyOutflow={analytics.monthlyOutflow}
            netSavingsRate={analytics.netSavingsRate}
            anomalyCount={analytics.anomalyCount}
          />

          {/* Visual Analytics Charts */}
          <ChartsSection
            isLoading={isLoading}
            trends={analytics.recentTrends}
            categoryBreakdown={analytics.categoryBreakdown}
          />

          {/* Category Budgets */}
          <BudgetProgress isLoading={isLoading} budgets={budgets} />

          {/* Transactions Table */}
          <TransactionTable
            isLoading={isLoading}
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onFilterChange={(filters) => fetchTransactions(filters)}
          />
        </main>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}

