import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ShieldCheck, TrendingUp, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';
import { Language, Transaction, TrustScore, InvestmentPlan } from '../types';
import { translations } from '../translations';
import { ScoreCard } from './ScoreCard';
import { InvestmentCard } from './InvestmentCard';

interface WizardProps {
  lang: Language;
  onComplete: (transactions: Transaction[], score: TrustScore | null, investment: InvestmentPlan | null) => void;
  onClose: () => void;
  calculateScore: (txs: Transaction[]) => Promise<void>;
  score: TrustScore | null;
  investment: InvestmentPlan | null;
  isLoading: boolean;
}

export const Wizard: React.FC<WizardProps> = ({ 
  lang, 
  onComplete, 
  onClose, 
  calculateScore, 
  score, 
  investment, 
  isLoading 
}) => {
  const [step, setStep] = useState(1);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const t = translations[lang];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const newTransactions: Transaction[] = lines.slice(1).map((line, index) => {
        const [date, amount, description, type, category] = line.split(',');
        return {
          id: `wiz-${index}`,
          date: date?.trim() || new Date().toISOString().split('T')[0],
          amount: parseFloat(amount?.trim() || '0'),
          description: description?.trim() || 'Untitled',
          type: (type?.trim().toLowerCase() === 'inflow' ? 'inflow' : 'outflow') as 'inflow' | 'outflow',
          category: category?.trim().toLowerCase() || 'other'
        };
      });
      setLocalTransactions(newTransactions);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const nextStep = () => {
    if (step === 2 && !score) {
      calculateScore(localTransactions);
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: 'Connect Data', icon: <Upload size={20} /> },
    { title: 'AI Scoring', icon: <ShieldCheck size={20} /> },
    { title: 'Growth Plan', icon: <TrendingUp size={20} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation Header */}
      <nav className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <TrendingUp size={16} />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-900">Khulisa Wizard</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => onComplete(localTransactions, score, investment)}
          className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-6 py-3 rounded-xl hover:bg-indigo-100 transition-colors"
        >
          Skip to Dashboard
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6 bg-gray-50/30 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="w-full max-w-4xl"
          >
            {step === 1 && (
              <div className="text-center space-y-12 max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-tight italic">
                    First, we need to <span className="text-indigo-600 underline decoration-8 decoration-indigo-600/10 underline-offset-8">Import</span> your data.
                  </h2>
                  <p className="text-xl text-gray-400 font-medium leading-relaxed">
                    Khulisa analyzes your mobile payment history to build your digital trust score.
                  </p>
                </div>
                
                <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-indigo-200/20 relative group">
                  <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-10 transition-opacity rounded-[3.5rem]"></div>
                  <Upload size={48} className="mx-auto text-indigo-600 mb-8" />
                  <label className="inline-block px-12 py-6 bg-indigo-600 text-white rounded-[2rem] text-lg font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 cursor-pointer hover:bg-indigo-700 transition-all active:scale-95">
                    Choose CSV File
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <p className="mt-8 text-xs font-black text-gray-300 uppercase tracking-[0.3em]">
                    Format: Date, Amount, Merchant, Type, Category
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none">
                    Analyzing your <span className="text-indigo-600">Digital Footprint</span>
                  </h2>
                  <p className="text-lg text-gray-400 font-medium">
                    We're looking for patterns of consistency and financial responsibility.
                  </p>
                </div>
                <ScoreCard score={score} lang={lang} onRefresh={() => calculateScore(localTransactions)} isLoading={isLoading} />
                {score && (
                  <div className="flex justify-center pt-8">
                    <button 
                      onClick={nextStep}
                      className="flex items-center gap-4 bg-gray-900 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl"
                    >
                      Continue to Growth Plan
                      <ArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none">
                    Your Personalized <span className="text-emerald-600">Growth Plan</span>
                  </h2>
                  <p className="text-lg text-gray-400 font-medium">
                    Based on your surplus, AI suggests a low-impact micro-investment path.
                  </p>
                </div>
                <div className="max-w-2xl mx-auto">
                  <InvestmentCard plan={investment} lang={lang} />
                </div>
                <div className="flex justify-center pt-12">
                   <button 
                      onClick={() => onComplete(localTransactions, score, investment)}
                      className="bg-emerald-600 text-white px-16 py-8 rounded-[2.5rem] text-xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-4"
                   >
                     Enter Khulisa Terminal
                     <CheckCircle2 size={24} />
                   </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Wizard Footer Controls */}
      {step > 1 && (
        <footer className="p-8 border-t border-gray-100 flex items-center justify-between">
          <button 
            onClick={prevStep}
            className="flex items-center gap-3 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-indigo-600' : 'bg-gray-100'}`}></div>
            ))}
          </div>

          <div className="w-20"></div>
        </footer>
      )}
    </div>
  );
};
