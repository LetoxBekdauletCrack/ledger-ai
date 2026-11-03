/**
 * AI Categorization and Statistical Anomaly Detection Engine
 */

export interface CategorySuggestion {
  suggestedCategory: string;
  confidence: number;
  reasoning: string;
}

export interface AnomalyResult {
  isAnomaly: boolean;
  reason?: string;
  zScore?: number;
  multiplier?: number;
  categoryMean?: number;
}

const CATEGORY_RULES: { keywords: string[]; category: string; confidence: number }[] = [
  // Salary / Income
  { keywords: ['payroll', 'salary', 'direct dep', 'stipend', 'employer', 'techcorp', 'apex systems'], category: 'Salary', confidence: 0.98 },
  { keywords: ['dividend', 'vanguard', 'fidelity', 'schwab', 'interest', 'capital gain', 'crypto', 'coinbase'], category: 'Investments', confidence: 0.95 },
  
  // Expenses
  { keywords: ['rent', 'lease', 'apartment', 'realty', 'avalon', 'mortgage', 'housing'], category: 'Housing', confidence: 0.96 },
  { keywords: ['whole foods', 'trader joe', 'safeway', 'sprouts', 'costco', 'grocery', 'supermarket', 'market', 'kroger', 'aldi'], category: 'Groceries', confidence: 0.94 },
  { keywords: ['blue bottle', 'starbucks', 'coffee', 'cafe', 'restaurant', 'chipotle', 'sweetgreen', 'nobu', 'pizza', 'burger', 'bakery', 'diner', 'dining', 'bistro'], category: 'Dining', confidence: 0.92 },
  { keywords: ['uber', 'lyft', 'taxi', 'transit', 'subway', 'metro', 'mta', 'gas', 'fuel', 'chevron', 'shell', 'exxon', 'parking', 'transport'], category: 'Transport', confidence: 0.93 },
  { keywords: ['coned', 'electric', 'verizon', 'at&t', 'water', 'power', 'utility', 'utilities', 'wifi', 'internet', 'comcast', 'pge'], category: 'Utilities', confidence: 0.95 },
  { keywords: ['netflix', 'spotify', 'hulu', 'hbo', 'disney', 'amc', 'cinema', 'theatre', 'steam', 'playstation', 'ticket', 'concert', 'festival'], category: 'Entertainment', confidence: 0.91 },
  { keywords: ['cvs', 'walgreens', 'pharmacy', 'clinic', 'medical', 'hospital', 'doctor', 'dental', 'health', 'quest diagnostics'], category: 'Healthcare', confidence: 0.90 },
  { keywords: ['amazon', 'target', 'walmart', 'apple', 'home depot', 'ikea', 'shopping'], category: 'Miscellaneous', confidence: 0.85 },
];

export function suggestCategory(merchant: string, description: string = ''): CategorySuggestion {
  const query = `${merchant} ${description}`.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (query.includes(keyword)) {
        return {
          suggestedCategory: rule.category,
          confidence: rule.confidence,
          reasoning: `Matched pattern '${keyword}' associated with ${rule.category}`,
        };
      }
    }
  }

  return {
    suggestedCategory: 'Miscellaneous',
    confidence: 0.60,
    reasoning: 'Default fallback category applied',
  };
}

export function detectAnomaly(
  amount: number,
  category: string,
  type: string = 'EXPENSE',
  historicalAmounts: number[] = []
): AnomalyResult {
  if (type === 'INCOME') {
    return { isAnomaly: false };
  }

  // Baseline if no historical data available
  if (historicalAmounts.length < 3) {
    if (amount > 1200 && category !== 'Housing') {
      return {
        isAnomaly: true,
        reason: `Discretionary charge of $${amount.toFixed(2)} is unusually large for new category '${category}'.`,
        multiplier: 2.5,
      };
    }
    return { isAnomaly: false };
  }

  const sum = historicalAmounts.reduce((a, b) => a + b, 0);
  const mean = sum / historicalAmounts.length;

  const variance = historicalAmounts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / historicalAmounts.length;
  const stdDev = Math.sqrt(variance) || 10;

  const zScore = parseFloat(((amount - mean) / stdDev).toFixed(2));
  const multiplier = parseFloat((amount / (mean || 1)).toFixed(2));

  // Flag as anomaly if zScore >= 2.5 OR amount is more than 2.8x category mean for amounts > $150
  if ((zScore >= 2.5 || multiplier >= 2.8) && amount > 150) {
    return {
      isAnomaly: true,
      reason: `Amount of $${amount.toFixed(2)} is ${multiplier}x higher than your historical ${category} average ($${mean.toFixed(2)}), with a z-score of ${zScore}.`,
      zScore,
      multiplier,
      categoryMean: parseFloat(mean.toFixed(2)),
    };
  }

  return {
    isAnomaly: false,
    zScore,
    multiplier,
    categoryMean: parseFloat(mean.toFixed(2)),
  };
}

