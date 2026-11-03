'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    merchant: string;
    description: string;
    date: string;
  }) => Promise<void>;
}

const CATEGORIES = [
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

export function AddTransactionModal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Dining');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live AI Category Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedCategory: string; confidence: number; reasoning: string } | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Live Anomaly Preview State
  const [anomalyWarning, setAnomalyWarning] = useState<string | null>(null);

  // Debounced AI Suggestion as user types merchant
  useEffect(() => {
    if (!merchant || merchant.length < 2) {
      setAiSuggestion(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSuggesting(true);
        const res = await fetch('/api/ai/suggest-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchant, description }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.suggestedCategory && data.suggestedCategory !== category) {
            setAiSuggestion(data);
          }
        }
      } catch (_) {}
      finally {
        setIsSuggesting(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [merchant, description, category]);

  // Live Anomaly Check as user enters high amounts
  useEffect(() => {
    const num = parseFloat(amount);
    if (!num || isNaN(num) || type === 'INCOME') {
      setAnomalyWarning(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/ai/detect-anomalies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: num, category, type }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isAnomaly) {
            setAnomalyWarning(data.reason || 'Amount significantly exceeds standard category variance.');
          } else {
            setAnomalyWarning(null);
          }
        }
      } catch (_) {}
    }, 400);

    return () => clearTimeout(timer);
  }, [amount, category, type]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount: parseFloat(amount),
        type,
        category,
        merchant,
        description,
        date,
      });
      // reset
      setAmount('');
      setMerchant('');
      setDescription('');
      setAiSuggestion(null);
      setAnomalyWarning(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyAiSuggestion = () => {
    if (aiSuggestion) {
      setCategory(aiSuggestion.suggestedCategory);
      setAiSuggestion(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 text-white"
        data-testid="add-transaction-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold">New Transaction</h3>
            <p className="text-xs text-slate-400">Record a manual entry with instant AI classification</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                if (category === 'Salary' || category === 'Investments') setCategory('Dining');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'EXPENSE'
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (Outflow)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('INCOME');
                setCategory('Salary');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                type === 'INCOME'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (Inflow)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Amount ($)</label>
            <Input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-base font-mono"
              data-testid="input-amount"
            />
          </div>

          {/* Live Anomaly Warning */}
          {anomalyWarning && (
            <div
              data-testid="anomaly-warning"
              className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300 animate-in slide-in-from-top-1"
            >
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-400">Spending Anomaly Flag:</span> {anomalyWarning}
              </div>
            </div>
          )}

          {/* Merchant */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Merchant / Source</label>
            <Input
              required
              placeholder="e.g. Uber, Whole Foods, TechCorp"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              data-testid="input-merchant"
            />
          </div>

          {/* AI Category Suggestion Pill */}
          {aiSuggestion && (
            <div
              data-testid="ai-category-suggestion"
              className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>
                  AI Suggestion: <strong className="text-emerald-400 underline">{aiSuggestion.suggestedCategory}</strong> ({Math.round(aiSuggestion.confidence * 100)}% match)
                </span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={applyAiSuggestion}
                data-testid="apply-ai-category-btn"
                className="h-7 text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20"
              >
                Apply
              </Button>
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-700 bg-slate-950/80 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              data-testid="select-category"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description (optional)</label>
              <Input
                placeholder="Notes or memo"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="input-description"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Date</label>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="input-date"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
              data-testid="submit-transaction-btn"
            >
              {isSubmitting ? 'Saving...' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

