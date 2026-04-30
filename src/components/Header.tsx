/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, Bell, Wallet, Globe, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  balance: number;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, balance }) => {
  const t = translations[lang];
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 rounded-xl overflow-hidden">
          <img src="/logo.svg" alt="Khulisa Logo" className="w-10 h-10 p-2" />
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

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right whitespace-normal"
              >
                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                     <div className="bg-indigo-100 text-indigo-600 p-2 rounded-full h-fit">
                       <Sparkles size={14} />
                     </div>
                     <div>
                       <p className="text-xs text-gray-900 font-medium leading-tight mb-1">AI Calculation Ready</p>
                       <p className="text-[11px] text-gray-500 leading-relaxed">Your transaction history has been analyzed. Calculate your Digital Trust Score to proceed.</p>
                       <p className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">Just now</p>
                     </div>
                  </div>
                  <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                     <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full h-fit">
                       <TrendingUp size={14} />
                     </div>
                     <div>
                       <p className="text-xs text-gray-900 font-medium leading-tight mb-1">Welcome to Khulisa</p>
                       <p className="text-[11px] text-gray-500 leading-relaxed">Start your journey towards financial growth. Import your first CSV file to unlock your dashboard.</p>
                       <p className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest">2 hours ago</p>
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button className="md:hidden p-2 text-gray-400">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};
