/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { TrustScore, Language } from '../types';
import { translations } from '../translations';

interface ScoreCardProps {
  score: TrustScore | null;
  lang: Language;
  onRefresh: () => void;
  isLoading: boolean;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score, lang, onRefresh, isLoading }) => {
  const t = translations[lang];

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-indigo-600">
          <ShieldCheck size={20} />
          <span className="font-semibold text-sm uppercase tracking-wider">{t.trustScore}</span>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : t.calculateScore}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-100"
            />
            {score && (
              <motion.circle
                initial={{ strokeDasharray: "0 503" }}
                animate={{ strokeDasharray: `${(score.score / 1000) * 503} 503` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                className="text-indigo-600"
              />
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{score ? score.score : '--'}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ 1000</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">{score ? t[`level${score.level}`] : '--'}</h3>
              {score && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified</span>}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {score ? score.explanation : t.scoringText}
            </p>
          </div>

          {score && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {score.recommendations.slice(0, 2).map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100/50">
                  <div className="mt-0.5 text-indigo-500 bg-white p-1 rounded-lg shadow-sm">
                    {i === 0 ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                  </div>
                  <span className="text-xs text-gray-600 font-medium leading-tight">{rec}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {!score && !isLoading && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
           <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-xs scale-95 animate-in fade-in zoom-in duration-500">
             <ShieldCheck className="mx-auto mb-3 text-indigo-600" size={32} />
             <p className="text-sm font-medium text-gray-900 mb-4">{t.scoringText}</p>
             <button 
               onClick={onRefresh}
               className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
             >
               {t.calculateScore}
             </button>
           </div>
        </div>
      )}
    </div>
);
};
