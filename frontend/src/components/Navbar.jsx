import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGES } from '../utils/languages';
import { Activity, Stethoscope, BarChart3, Globe, LogIn } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function Navbar({ currentLang, setLanguage }) {
  const location = useLocation();
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 mono-card border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-md group-hover:border-slate-500 transition-colors">
              <Activity className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">
                  Tena AI
                </span>
                <span className="text-[11px] font-semibold bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="font-ethiopic">ጤና AI</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Multilingual AI Medical Triage
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <Link
              to="/hew-triage"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive('/hew-triage')
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-ethiopic">{t.hewPortal}</span>
            </Link>

            <Link
              to="/doctor-queue"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all relative ${
                isActive('/doctor-queue')
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-ethiopic">{t.doctorPortal}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ml-1"></span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive('/analytics')
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-ethiopic">{t.analyticsPortal}</span>
            </Link>
          </div>

          {/* Language Selector Dropdown & Auth Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-sm hover:border-slate-700 transition-colors">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-2"
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
                  <button className="flex items-center space-x-1.5 bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm">
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="p-0.5 rounded-full border border-slate-700">
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
