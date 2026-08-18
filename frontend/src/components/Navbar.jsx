import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGES } from '../utils/languages';
import { Activity, Stethoscope, BarChart3, Globe, LogIn, Sparkles, Radio } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function Navbar({ currentLang, setLanguage }) {
  const location = useLocation();
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl">
                <Activity className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent font-sans">
                  Tena AI
                </span>
                <span className="text-xs font-extrabold ethio-badge bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-ethiopic">ጤና AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Multilingual AI Triage • Medical Tele-Diagnostics
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
            <Link
              to="/hew-triage"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/hew-triage')
                  ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-lg glow-teal'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Activity className="w-4 h-4 text-teal-400" />
              <span className="font-ethiopic">{t.hewPortal}</span>
            </Link>

            <Link
              to="/doctor-queue"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                isActive('/doctor-queue')
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-lg glow-rose'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span className="font-ethiopic">{t.doctorPortal}</span>
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive('/analytics')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-lg glow-amber'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="font-ethiopic">{t.analyticsPortal}</span>
            </Link>
          </div>

          {/* Language Selector Dropdown & Clerk Auth Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-950/80 border border-slate-800 rounded-2xl px-3 py-2 shadow-inner hover:border-teal-500/50 transition-colors">
              <Globe className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="amharic" className="bg-slate-950 text-white">🇪🇹 አማርኛ (Amharic)</option>
                <option value="oromo" className="bg-slate-950 text-white">🇪🇹 Afaan Oromoo</option>
                <option value="tigrinya" className="bg-slate-950 text-white">🇪🇹 ትግርኛ (Tigrinya)</option>
                <option value="english" className="bg-slate-950 text-white">🌐 English</option>
              </select>
            </div>

            {/* Clerk Authentication Controls */}
            <div className="flex items-center space-x-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg glow-teal transition-all hover:scale-105">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="p-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-amber-500 shadow-md">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
