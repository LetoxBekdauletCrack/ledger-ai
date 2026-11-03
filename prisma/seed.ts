import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const MERCHANTS_BY_CATEGORY: Record<string, { merchants: string[]; typicalRange: [number, number]; type: 'INCOME' | 'EXPENSE' }> = {
  Salary: {
    merchants: ['TechCorp Global Payroll', 'Apex Systems Direct Deposit', 'Freelance Client Retainer'],
    typicalRange: [3500, 6500],
    type: 'INCOME',
  },
  Investments: {
    merchants: ['Vanguard Total Stock Index', 'Fidelity Dividend Distribution', 'Charles Schwab Yield'],
    typicalRange: [150, 800],
    type: 'INCOME',
  },
  Housing: {
    merchants: ['Avalon Bay Communities', 'Highland Properties Management', 'Metropolitan Realty'],
    typicalRange: [1600, 2400],
    type: 'EXPENSE',
  },
  Groceries: {
    merchants: ['Whole Foods Market', 'Trader Joe\'s', 'Safeway Fresh', 'Sprouts Farmers Market', 'Costco Wholesale'],
    typicalRange: [40, 220],
    type: 'EXPENSE',
  },
  Dining: {
    merchants: ['Blue Bottle Coffee', 'Chipotle Mexican Grill', 'Sweetgreen Organic Bowls', 'Nobu Dining', 'Joe\'s Pizza NYC'],
    typicalRange: [12, 110],
    type: 'EXPENSE',
  },
  Transport: {
    merchants: ['Uber Technologies', 'Lyft Rideshare', 'Metropolitan Transit Authority', 'Chevron Fuel', 'Shell Oil'],
    typicalRange: [15, 75],
    type: 'EXPENSE',
  },
  Utilities: {
    merchants: ['ConEdison Electric & Gas', 'Verizon Wireless FiOS', 'City Water Works', 'AT&T Fiber'],
    typicalRange: [60, 180],
    type: 'EXPENSE',
  },
  Entertainment: {
    merchants: ['Netflix Streaming', 'Spotify Premium', 'AMC Theatres', 'Steam Digital Games', 'Live Nation Tickets'],
    typicalRange: [15, 120],
    type: 'EXPENSE',
  },
  Healthcare: {
    merchants: ['CVS Pharmacy', 'Walgreens Health', 'One Medical Clinic', 'Quest Diagnostics'],
    typicalRange: [25, 190],
    type: 'EXPENSE',
  },
  Miscellaneous: {
    merchants: ['Amazon Marketplace', 'Target Superstore', 'Apple Online Store', 'Home Depot'],
    typicalRange: [20, 250],
    type: 'EXPENSE',
  },
};

const CATEGORY_COLORS: Record<string, string> = {
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

async function main() {
  console.log('🌱 Starting LedgerAI SQLite Seed...');

  // 1. Upsert Demo User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@ledgerai.com' },
    update: {},
    create: {
      email: 'demo@ledgerai.com',
      password: hashedPassword,
      name: 'Alex Morgan',
    },
  });
  console.log(`👤 User configured: ${demoUser.email} (id: ${demoUser.id})`);

  // 2. Upsert Categories
  for (const [name, config] of Object.entries(MERCHANTS_BY_CATEGORY)) {
    await prisma.category.upsert({
      where: { name },
      update: { color: CATEGORY_COLORS[name] || '#94A3B8', type: config.type },
      create: {
        name,
        color: CATEGORY_COLORS[name] || '#94A3B8',
        type: config.type,
      },
    });
  }

  // 3. Upsert Budgets
  const budgetLimits: Record<string, number> = {
    Housing: 2200,
    Groceries: 650,
    Dining: 450,
    Transport: 250,
    Entertainment: 300,
    Utilities: 250,
    Healthcare: 200,
    Miscellaneous: 350,
  };

  for (const [category, monthlyLimit] of Object.entries(budgetLimits)) {
    await prisma.budget.upsert({
      where: {
        userId_category: {
          userId: demoUser.id,
          category,
        },
      },
      update: { monthlyLimit },
      create: {
        userId: demoUser.id,
        category,
        monthlyLimit,
      },
    });
  }

  // 4. Clean existing transactions for idempotent seeding
  await prisma.anomalyAlert.deleteMany({});
  await prisma.transaction.deleteMany({ where: { userId: demoUser.id } });

  // 5. Generate 500 realistic transactions
  console.log('Generating 500 transactions spread across the past 365 days...');
  const transactionsToCreate = [];
  const categories = Object.keys(MERCHANTS_BY_CATEGORY);
  const now = Date.now();

  for (let i = 0; i < 500; i++) {
    // Distribute across last 365 days, weighting recent months more heavily
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 365);
    const date = new Date(now - daysAgo * 86400000 - Math.floor(Math.random() * 3600000));
    
    // Choose category with weighted probabilities
    let category: string;
    const rand = Math.random();
    if (rand < 0.15) category = 'Salary';
    else if (rand < 0.20) category = 'Investments';
    else if (rand < 0.40) category = 'Groceries';
    else if (rand < 0.55) category = 'Dining';
    else if (rand < 0.65) category = 'Transport';
    else if (rand < 0.75) category = 'Housing';
    else if (rand < 0.85) category = 'Utilities';
    else if (rand < 0.92) category = 'Entertainment';
    else category = 'Miscellaneous';

    const catMeta = MERCHANTS_BY_CATEGORY[category];
    const merchant = catMeta.merchants[Math.floor(Math.random() * catMeta.merchants.length)];
    const [minAmount, maxAmount] = catMeta.typicalRange;
    
    let amount = parseFloat((minAmount + Math.random() * (maxAmount - minAmount)).toFixed(2));
    let isAnomaly = false;
    let anomalyReason: string | undefined = undefined;

    // Inject ~3-4% anomalies with unusual spending spikes
    if (i % 28 === 0 && catMeta.type === 'EXPENSE') {
      amount = parseFloat((maxAmount * (2.8 + Math.random() * 2.5)).toFixed(2));
      isAnomaly = true;
      anomalyReason = `High expenditure alert: $${amount.toFixed(2)} exceeds 2.5x typical historical ${category} average ($${((minAmount + maxAmount) / 2).toFixed(2)}).`;
    }

    transactionsToCreate.push({
      userId: demoUser.id,
      amount,
      type: catMeta.type,
      category,
      merchant,
      description: `${merchant} - ${category} transaction`,
      date,
      status: daysAgo > 3 ? 'POSTED' : (Math.random() > 0.4 ? 'POSTED' : 'PENDING'),
      isAnomaly,
      anomalyReason,
    });
  }

  // Bulk insert
  await prisma.transaction.createMany({
    data: transactionsToCreate,
  });

  // Create AnomalyAlert rows for flagged transactions
  const anomalies = await prisma.transaction.findMany({
    where: { userId: demoUser.id, isAnomaly: true },
  });

  for (const anomaly of anomalies) {
    await prisma.anomalyAlert.create({
      data: {
        transactionId: anomaly.id,
        severity: anomaly.amount > 1500 ? 'HIGH' : 'MEDIUM',
        message: anomaly.anomalyReason || 'Unusual charge variance detected',
        resolved: false,
      },
    });
  }

  console.log(`✅ Seed finished successfully! 500 transactions & ${anomalies.length} anomaly alerts created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

