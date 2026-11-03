/**
 * LedgerAI Financial Mock Data & In-Memory Service Layer
 * Used for development fixtures, testing, and offline fallback.
 */

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  merchant: string;
  description: string;
  date: string;
  status: 'POSTED' | 'PENDING';
  isAnomaly?: boolean;
  anomalyReason?: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  spent: number;
}

export interface AnalyticsSummary {
  totalBalance: number;
  monthlyInflow: number;
  monthlyOutflow: number;
  netSavingsRate: number;
  anomalyCount: number;
  recentTrends: {
    month: string;
    income: number;
    expense: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
}

export const CATEGORY_COLORS: Record<string, string> = {
  Salary: '#10B981',
  Investments: '#06B6D4',
  Housing: '#6366F1',
  Groceries: '#F59E0B',
  Dining: '#EC4899',
  Transport: '#8B5CF6',
  Utilities: '#3B82F6',
  Entertainment: '#F97316',
  Healthcare: '#14B8A6',
  Miscellaneous: '#94A3B8',
};

export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-101",
    userId: "usr-demo",
    amount: 5500.00,
    type: "INCOME",
    category: "Salary",
    merchant: "TechCorp Global",
    description: "Monthly Payroll Direct Deposit",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "tx-102",
    userId: "usr-demo",
    amount: 1850.00,
    type: "EXPENSE",
    category: "Housing",
    merchant: "Avalon Bay Properties",
    description: "Apartment Monthly Rent",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "tx-103",
    userId: "usr-demo",
    amount: 164.20,
    type: "EXPENSE",
    category: "Groceries",
    merchant: "Whole Foods Market",
    description: "Organic Groceries & Produce",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "tx-104",
    userId: "usr-demo",
    amount: 42.50,
    type: "EXPENSE",
    category: "Dining",
    merchant: "Blue Bottle Coffee",
    description: "Specialty Espresso Beans & Pastries",
    date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "tx-105",
    userId: "usr-demo",
    amount: 32.18,
    type: "EXPENSE",
    category: "Transport",
    merchant: "Uber Technologies",
    description: "Late evening downtown ride",
    date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "tx-106",
    userId: "usr-demo",
    amount: 1450.00,
    type: "EXPENSE",
    category: "Entertainment",
    merchant: "VIP Tickets Direct",
    description: "VIP Music Festival Weekend Pass",
    date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: true,
    anomalyReason: "Transaction amount is 4.8x higher than your historical Entertainment average ($302.00)",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "tx-107",
    userId: "usr-demo",
    amount: 85.00,
    type: "EXPENSE",
    category: "Utilities",
    merchant: "City Water & Power",
    description: "Residential utility bill",
    date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    id: "tx-108",
    userId: "usr-demo",
    amount: 450.00,
    type: "INCOME",
    category: "Investments",
    merchant: "Vanguard Dividend Fund",
    description: "Quarterly Index Fund Distribution",
    date: new Date(Date.now() - 9 * 86400000).toISOString().split('T')[0],
    status: "POSTED",
    isAnomaly: false,
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString()
  }
];

export const INITIAL_MOCK_BUDGETS: Budget[] = [
  { id: "b-1", userId: "usr-demo", category: "Housing", monthlyLimit: 2000, spent: 1850 },
  { id: "b-2", userId: "usr-demo", category: "Groceries", monthlyLimit: 600, spent: 480 },
  { id: "b-3", userId: "usr-demo", category: "Dining", monthlyLimit: 400, spent: 342 },
  { id: "b-4", userId: "usr-demo", category: "Transport", monthlyLimit: 250, spent: 185 },
  { id: "b-5", userId: "usr-demo", category: "Entertainment", monthlyLimit: 500, spent: 1550 },
  { id: "b-6", userId: "usr-demo", category: "Utilities", monthlyLimit: 200, spent: 145 },
];

export class FinanceMockService {
  private transactions: Transaction[] = [...INITIAL_MOCK_TRANSACTIONS];
  private budgets: Budget[] = [...INITIAL_MOCK_BUDGETS];

  async getTransactions(filter?: { category?: string; type?: 'INCOME' | 'EXPENSE'; search?: string }): Promise<Transaction[]> {
    let result = [...this.transactions];
    if (filter?.category && filter.category !== 'ALL') {
      result = result.filter(t => t.category.toLowerCase() === filter.category!.toLowerCase());
    }
    if (filter?.type) {
      result = result.filter(t => t.type === filter.type);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(t => 
        t.merchant.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async addTransaction(data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const isAnomaly = data.amount > 1000 && data.type === 'EXPENSE';
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      isAnomaly: data.isAnomaly ?? isAnomaly,
      anomalyReason: isAnomaly ? `Unusual spike detected: $${data.amount.toFixed(2)} exceeds standard threshold.` : undefined,
    };
    this.transactions.unshift(newTx);
    return newTx;
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const income = this.transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = this.transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = income - expense;
    const netSavingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;
    const anomalyCount = this.transactions.filter(t => t.isAnomaly).length;

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    for (const t of this.transactions) {
      if (t.type === 'EXPENSE') {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    }

    const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0,
      color: CATEGORY_COLORS[category] || '#94A3B8',
    })).sort((a, b) => b.amount - a.amount);

    return {
      totalBalance,
      monthlyInflow: income,
      monthlyOutflow: expense,
      netSavingsRate,
      anomalyCount,
      recentTrends: [
        { month: 'Jun', income: 4800, expense: 3200 },
        { month: 'Jul', income: 5200, expense: 3400 },
        { month: 'Aug', income: 5100, expense: 3100 },
        { month: 'Sep', income: 5600, expense: 3600 },
        { month: 'Oct', income: 5400, expense: 3450 },
        { month: 'Nov', income: Math.round(income), expense: Math.round(expense) },
      ],
      categoryBreakdown,
    };
  }

  async getBudgets(): Promise<Budget[]> {
    return [...this.budgets];
  }
}

export const mockFinanceService = new FinanceMockService();

