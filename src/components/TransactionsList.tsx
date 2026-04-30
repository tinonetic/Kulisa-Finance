/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Utensils, Zap, Smartphone, MoreHorizontal, TrendingDown, Search } from 'lucide-react';
import { Transaction, Language } from '../types';
import { translations } from '../translations';

interface TransactionsListProps {
  transactions: Transaction[];
  lang: Language;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <Utensils size={18} />;
    case 'utilities': return <Zap size={18} />;
    case 'shopping': return <ShoppingBag size={18} />;
    case 'top-up': return <Smartphone size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return 'bg-orange-100 text-orange-600';
    case 'utilities': return 'bg-yellow-100 text-yellow-600';
    case 'shopping': return 'bg-purple-100 text-purple-600';
    case 'top-up': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, lang }) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(search.toLowerCase()) ||
    tx.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-gray-900">{t.recentTransactions}</h3>
        
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder={lang === 'zu' ? 'Funa...' : 'Search...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-100 w-full sm:w-64 transition-all"
          />
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${getCategoryColor(tx.category)}`}>
                {getCategoryIcon(tx.category)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-sm">{tx.description}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{tx.category}</span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span className="text-[10px] font-bold text-gray-400">{tx.date}</span>
                </div>
              </div>

              <div className="text-right">
                <div className={`flex items-center justify-end gap-1 font-black ${tx.type === 'inflow' ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {tx.type === 'inflow' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                  <span className="tabular-nums">R {tx.amount.toFixed(2)}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.type}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-400 italic text-sm">
            {t.noTransactions}
          </div>
        )}
      </div>
    </div>
  );
};
