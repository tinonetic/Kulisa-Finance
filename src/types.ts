/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'inflow' | 'outflow';
  category: string;
}

export interface TrustScore {
  score: number; // 0 to 1000
  level: 'Starter' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  explanation: string;
  recommendations: string[];
}

export interface InvestmentPlan {
  suggestedAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  projectedReturn: number;
  reasoning: string;
}

export type Language = 'en' | 'zu' | 'xh' | 'af';
