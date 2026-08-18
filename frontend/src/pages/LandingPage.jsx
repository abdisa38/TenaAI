import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mic, Camera, Stethoscope, Globe, ShieldAlert, Sparkles, ArrowRight, CheckCircle2, Cpu, HeartPulse, Network, Terminal, Code2 } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function LandingPage({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  return (
    <div className="space-y-20 py-10 max-w-7xl mx-auto px-4">
      
      {/* Hero Showcase Section */}
      <div className="relative text-center space-y-8 pt-8 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="inline-flex items-center space-x-2 bg-slate-950/80 border border-teal-500/40 px-4 py-2 rounded-full text-xs font-black text-teal-300 shadow-2xl backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>STARTUP HEALTH TECH INNOVATION FOR ETHIOPIA & EAST AFRICA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight font-sans">
          Multilingual AI Medical Triage & Tele-Diagnostics Network for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Ethiopian Society</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          Overcoming language & literacy barriers in rural health extension posts. Speak medical symptoms in <strong className="text-emerald-400">Amharic (አማርኛ)</strong>, <strong className="text-teal-400">Afaan Oromoo</strong>, or <strong className="text-amber-400">Tigrinya (ትግርኛ)</strong>, or upload wound photos for instant Google Gemini AI clinical triage and tele-doctor video calls.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
          <Link
            to="/hew-triage"
            className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-all text-base glow-teal"
          >
            <Mic className="w-5 h-5" />
            <span className="font-ethiopic">Try Voice AI Triage Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/doctor-queue"
            className="flex items-center space-x-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-extrabold px-7 py-4 rounded-2xl transition-all text-base shadow-2xl hover:border-rose-500/50"
          >
            <Stethoscope className="w-5 h-5 text-rose-400" />
            <span className="font-ethiopic">Open Tele-Doctor Queue</span>
          </Link>
        </div>
      </div>

      {/* 3 Core Tech Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel glass-panel-hover rounded-3xl p-7 shadow-2xl space-y-4 border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center glow-rose">
            <Mic className="w-7 h-7 text-rose-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Voice-First Local Languages</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Health Extension Workers record native speech in Amharic, Afaan Oromoo, or Tigrinya. Gemini 2.0 processes audio without requiring complex typing.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-7 shadow-2xl space-y-4 border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center glow-teal">
            <Camera className="w-7 h-7 text-teal-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Multimodal Vision Diagnostics</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Snap photos of open wounds, skin lesions, burns, or eye infections. Gemini Vision AI identifies clinical indicators and scores emergency urgency.
          </p>
        </div>

        <div className="glass-panel glass-panel-hover rounded-3xl p-7 shadow-2xl space-y-4 border border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center glow-amber">
            <Stethoscope className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Emergency Tele-Doctor WebRTC</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Critical RED triage alerts trigger instant emergency notifications to regional doctors in Addis Ababa, Adama, or Mekelle, opening a live WebRTC video consultation room.
          </p>
        </div>

      </div>

      {/* GitHub Student Developer Pack Tools Matrix */}
      <div className="glass-panel rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-800">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>FULL PRODUCTION STACK & DEVELOPER PACK ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">GitHub Student Developer Pack & Google AI Ecosystem</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-bold text-slate-200">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">MongoDB Atlas</span>
              <span className="text-[10px] text-slate-400">MERN Cloud Database</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">Google Gemini AI</span>
              <span className="text-[10px] text-slate-400">Multimodal Speech & Vision</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">Appwrite Cloud</span>
              <span className="text-[10px] text-slate-400">BaaS Storage & Realtime</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">Clerk Identity</span>
              <span className="text-[10px] text-slate-400">Multi-Role User Auth</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">Stripe Sandbox</span>
              <span className="text-[10px] text-slate-400">Tele-Doctor Billing Logs</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">Testmail.app</span>
              <span className="text-[10px] text-slate-400">Emergency Alert Testing</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">ToDiagram</span>
              <span className="text-[10px] text-slate-400">Referral Flow Schemas</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 flex items-center space-x-3 shadow-inner">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="block font-black text-white">DigitalOcean</span>
              <span className="text-[10px] text-slate-400">Cloud App Platform</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
