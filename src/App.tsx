/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScoreCard } from './components/ScoreCard';
import { InvestmentCard } from './components/InvestmentCard';
import { TransactionsList } from './components/TransactionsList';
import { Transaction, TrustScore, InvestmentPlan, Language } from './types';
import { analyzeTransactions } from './services/geminiService';
import { translations } from './translations';
import { motion, AnimatePresence } from 'motion/react';
import { Wizard } from './components/Wizard';
import { Wallet, TrendingUp, TrendingDown, Upload, PlayCircle, Sparkles } from 'lucide-react';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2026-04-28', amount: 1500, description: 'Client Payment', type: 'inflow', category: 'income' },
  { id: '2', date: '2026-04-28', amount: 350, description: 'Pick n Pay Spaza', type: 'outflow', category: 'food' },
  { id: '3', date: '2026-04-29', amount: 200, description: 'Vodacom Top Up', type: 'outflow', category: 'top-up' },
  { id: '4', date: '2026-04-29', amount: 600, description: 'Eskom Prepaid', type: 'outflow', category: 'utilities' },
  { id: '5', date: '2026-04-30', amount: 2500, description: 'Stock Purchase', type: 'outflow', category: 'business' },
  { id: '6', date: '2026-04-30', amount: 4500, description: 'Weekly Revenue', type: 'inflow', category: 'income' },
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [score, setScore] = useState<TrustScore | null>(null);
  const [investment, setInvestment] = useState<InvestmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const t = translations[lang];

  const handleStartSaving = (amount: number) => {
    setIsSaving(true);
    setSavingsBalance(prev => prev + amount);
    // Simulate a successful investment initiation
    setTimeout(() => setIsSaving(false), 2000);
  };

  const handleCalculateScore = async (txs: Transaction[] = transactions) => {
    setIsLoading(true);
    try {
      const result = await analyzeTransactions(txs);
      setScore(result.score);
      setInvestment(result.investment);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWizardComplete = (txs: Transaction[], s: TrustScore | null, i: InvestmentPlan | null) => {
    if (txs.length > 0) setTransactions(txs);
    if (s) setScore(s);
    if (i) setInvestment(i);
    setShowWizard(false);
  };

  const totals = transactions.reduce((acc, tx) => {
    if (tx.type === 'inflow') acc.inflow += tx.amount;
    else acc.outflow += tx.amount;
    return acc;
  }, { inflow: 0, outflow: 0 });

  const balance = totals.inflow - totals.outflow;
  const spendRatio = totals.inflow > 0 ? (totals.outflow / totals.inflow) * 100 : 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      // Skip header and map to Transaction type
      const newTransactions: Transaction[] = lines.slice(1).map((line, index) => {
        const [date, amount, description, type, category] = line.split(',');
        return {
          id: `imported-${index}`,
          date: date?.trim() || new Date().toISOString().split('T')[0],
          amount: parseFloat(amount?.trim() || '0'),
          description: description?.trim() || 'Untitled',
          type: (type?.trim().toLowerCase() === 'inflow' ? 'inflow' : 'outflow') as 'inflow' | 'outflow',
          category: category?.trim().toLowerCase() || 'other'
        };
      });
      
      setTransactions(newTransactions);
      setScore(null); // Reset score so user re-calculates with new data
      setInvestment(null);
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const csvContent = "Date,Amount,Description,Type,Category\n" +
      "2026-05-01,2500.00,Monthly Salary,inflow,income\n" +
      "2026-05-02,450.00,Grocery Store,outflow,food\n" +
      "2026-05-03,120.00,Airtime Top-up,outflow,top-up\n" +
      "2026-05-04,800.00,Rent Payment,outflow,utilities\n" +
      "2026-05-05,150.00,Freelance Project,inflow,income\n" +
      "2026-05-06,200.00,Petrol,outflow,transport";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'khulisa_sample_transactions.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <AnimatePresence>
        {showWizard && (
          <Wizard 
            lang={lang}
            score={score}
            investment={investment}
            isLoading={isLoading}
            onClose={() => setShowWizard(false)}
            onComplete={handleWizardComplete}
            calculateScore={handleCalculateScore}
            onStartSaving={handleStartSaving}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>

      <Header lang={lang} setLang={setLang} balance={balance} />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* User Flow Indicator */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-b border-gray-100/50 px-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${transactions.length > MOCK_TRANSACTIONS.length ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Import Data</span>
             </div>
             <div className="hidden md:block w-8 h-px bg-gray-200"></div>
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${score ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">AI Analysis</span>
             </div>
             <div className="hidden md:block w-8 h-px bg-gray-200"></div>
             <div className="flex items-center gap-3">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${investment ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
               <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Grow Fund</span>
             </div>
          </div>
          
          <button 
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlayCircle size={16} />
            Start Guided Tour
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden relative group">
            <div className="flex items-center gap-3 text-gray-400 mb-4 uppercase tracking-widest font-black text-[10px]">
              <Wallet size={16} />
              {t.totalBalance}
            </div>
            <div className="text-3xl font-black tracking-tight tabular-nums relative z-10">
              R {balance.toLocaleString()}
            </div>
            {/* Simple Budget Health Bar */}
            <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.min(spendRatio, 100)}%` }}
                 className={`h-full ${spendRatio > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
               />
            </div>
            <div className="mt-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
               <span>Spend Ratio</span>
               <span className={spendRatio > 80 ? 'text-red-500' : 'text-indigo-600'}>{spendRatio.toFixed(0)}%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-600 mb-4 uppercase tracking-widest font-black text-[10px]">
              <Sparkles size={16} />
              Portfolio
            </div>
            <div className="text-3xl font-black tracking-tight text-indigo-600 tabular-nums">
              R {savingsBalance.toLocaleString()}
            </div>
            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
               <TrendingUp size={10} className="text-emerald-500" />
               <span className="text-emerald-500">+12%</span> Predicted
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-500 mb-4 uppercase tracking-widest font-black text-[10px]">
              <TrendingUp size={16} />
              {t.monthlyInflow}
            </div>
            <div className="text-3xl font-black tracking-tight text-emerald-600 tabular-nums">
              R {totals.inflow.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 text-red-500 mb-4 uppercase tracking-widest font-black text-[10px]">
              <TrendingDown size={16} />
              {t.monthlyOutflow}
            </div>
            <div className="text-3xl font-black tracking-tight text-red-600 tabular-nums">
              R {totals.outflow.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Core AI Features */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <AnimatePresence mode="wait">
             <motion.div
               key={lang + (score ? 'scored' : 'empty')}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4 }}
               className="h-full"
             >
               <ScoreCard score={score} lang={lang} onRefresh={handleCalculateScore} isLoading={isLoading} />
             </motion.div>
           </AnimatePresence>

           <AnimatePresence mode="wait">
             <motion.div
               key={lang + (investment ? 'planned' : 'empty')}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4, delay: 0.1 }}
               className="h-full"
             >
               <InvestmentCard 
                 plan={investment} 
                 lang={lang} 
                 onStartSaving={handleStartSaving}
                 isSaving={isSaving}
               />
             </motion.div>
           </AnimatePresence>
        </section>

        {/* Transactions Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{t.transactions}</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={downloadSampleCSV}
                className="px-4 py-2 bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Download Sample
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <Upload size={14} />
                Import CSV
                <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          <TransactionsList transactions={transactions} lang={lang} />
          
          <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
             <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">
               Format: Date, Amount, Description, Type(inflow/outflow), Category
             </p>
          </div>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-100/50 mt-10 text-center">
         <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{t.appName} &copy; 2026 • AI-Powered Empowerment</p>
      </footer>
    </div>
  );
}

