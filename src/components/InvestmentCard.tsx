/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, Wallet, PieChart, TrendingUp } from 'lucide-react';
import { InvestmentPlan, Language } from '../types';
import { translations } from '../translations';

interface InvestmentCardProps {
  plan: InvestmentPlan | null;
  lang: Language;
  onStartSaving: (amount: number) => void;
  isSaving?: boolean;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({ plan, lang, onStartSaving, isSaving }) => {
  const t = translations[lang];

  return (
    <div className="bg-gradient-to-br from-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl -ml-24 -mb-24"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-300" />
            <span className="font-bold text-sm uppercase tracking-wider text-indigo-100">{t.aiRecommendation}</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <PieChart size={24} />
          </div>
        </div>

        <div className="mb-8 flex-1">
          <h2 className="text-3xl font-black mb-2 tracking-tight">{t.investmentTitle}</h2>
          <p className="text-indigo-100/70 text-sm leading-relaxed max-w-md">
            {plan ? plan.reasoning : t.investmentText}
          </p>
        </div>

        {plan ? (
          <div className="flex flex-col md:flex-row items-end justify-between gap-8">
             <div className="w-full md:w-auto">
               <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest block mb-1">Recommended Deposit</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black tabular-nums">R {plan.suggestedAmount}</span>
                 <span className="text-indigo-200 font-bold">/ {plan.frequency}</span>
               </div>
               <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold text-sm">
                 <TrendingUp size={16} />
                 <span>+ {plan.projectedReturn}% Est. Annual Growth</span>
               </div>
             </div>

             <button 
                onClick={() => onStartSaving(plan.suggestedAmount)}
                disabled={isSaving}
                className={`w-full md:w-auto px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 group shadow-xl ${
                  isSaving 
                    ? 'bg-emerald-500 text-white shadow-emerald-900/40' 
                    : 'bg-white text-indigo-700 shadow-indigo-900/40 hover:bg-indigo-50'
                }`}
             >
                {isSaving ? 'Growth Started!' : t.startSaving}
                {isSaving ? <TrendingUp size={20} /> : <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />}
             </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 italic text-indigo-200 text-sm">
            Please calculate your AI Trust Score to unlock investment insights.
          </div>
        )}
      </div>
    </div>
  );
};
