import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGES } from '../utils/languages';
import { Activity, Stethoscope, BarChart3, Globe, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar({ currentLang, setLanguage }) {
  const location = useLocation();
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Ethiopian Flag Pill */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Tena AI
                </span>
                <span className="text-sm font-semibold ethio-badge bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  ጤና AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Multilingual Medical Triage • Google Gemini Powered
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/hew-triage"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive('/hew-triage')
                  ? 'bg-teal-600/20 text-teal-300 border border-teal-500/40 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span>{t.hewPortal}</span>
            </Link>

            <Link
              to="/doctor-queue"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive('/doctor-queue')
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>{t.doctorPortal}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive('/analytics')
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>{t.analyticsPortal}</span>
            </Link>
          </div>

          {/* Language Selector Dropdown (Amharic / Afaan Oromoo / Tigrinya / English) */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 shadow-sm hover:border-teal-500 transition-colors">
              <Globe className="w-4 h-4 text-teal-400 mr-2" />
              <select
                value={currentLang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer pr-2"
              >
                <option value="amharic" className="bg-slate-900 text-white">🇪🇹 አማርኛ (Amharic)</option>
                <option value="oromo" className="bg-slate-900 text-white">🇪🇹 Afaan Oromoo</option>
                <option value="tigrinya" className="bg-slate-900 text-white">🇪🇹 ትግርኛ (Tigrinya)</option>
                <option value="english" className="bg-slate-900 text-white">🌐 English</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
