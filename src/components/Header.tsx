/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Bell, Wallet, Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  balance: number;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, balance }) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl text-white">
          <Wallet size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t.appName}</h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">{t.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
          {(['en', 'zu', 'xh', 'af'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                lang === l ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="md:hidden relative group">
           <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
             <Globe size={20} />
           </button>
           <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-100 hidden group-hover:block overflow-hidden">
              {(['en', 'zu', 'xh', 'af'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  {l === 'en' ? 'English' : l === 'zu' ? 'isiZulu' : l === 'xh' ? 'isiXhosa' : 'Afrikaans'}
                </button>
              ))}
           </div>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <button className="md:hidden p-2 text-gray-400">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};
