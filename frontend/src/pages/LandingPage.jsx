import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mic, Camera, Stethoscope, ArrowRight, CheckCircle2, Cpu, Code2 } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function LandingPage({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4">
      
      {/* Hero Showcase Section */}
      <div className="text-center space-y-7 pt-6">
        <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-300 shadow-sm">
          <Cpu className="w-3.5 h-3.5 text-slate-300" />
          <span>STARTUP HEALTH TECH INNOVATION FOR ETHIOPIA & EAST AFRICA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight font-sans">
          Multilingual AI Medical Triage & Tele-Diagnostics Network for <span className="text-slate-300">Ethiopian Society</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Overcoming language & literacy barriers in rural health extension posts. Speak medical symptoms in <strong className="text-slate-200">Amharic (አማርኛ)</strong>, <strong className="text-slate-200">Afaan Oromoo</strong>, or <strong className="text-slate-200">Tigrinya (ትግርኛ)</strong>, or upload wound photos for instant Google Gemini AI clinical triage and tele-doctor video calls.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/hew-triage"
            className="flex items-center space-x-2 bg-slate-100 hover:bg-white text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-md transition-all text-xs"
          >
            <Mic className="w-4 h-4" />
            <span className="font-ethiopic">Try Voice AI Triage Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/doctor-queue"
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-6 py-3.5 rounded-xl transition-all text-xs shadow-sm"
          >
            <Stethoscope className="w-4 h-4 text-slate-400" />
            <span className="font-ethiopic">Open Tele-Doctor Queue</span>
          </Link>
        </div>
      </div>

      {/* 3 Core Tech Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="mono-card mono-card-hover rounded-2xl p-6 shadow-sm border border-slate-800 space-y-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Mic className="w-5 h-5 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-white">Voice-First Local Languages</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Health Extension Workers record native speech in Amharic, Afaan Oromoo, or Tigrinya. Gemini AI processes audio without requiring complex typing.
          </p>
        </div>

        <div className="mono-card mono-card-hover rounded-2xl p-6 shadow-sm border border-slate-800 space-y-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Camera className="w-5 h-5 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-white">Multimodal Vision Diagnostics</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Snap photos of open wounds, skin lesions, burns, or eye infections. Gemini Vision AI identifies clinical indicators and scores emergency urgency.
          </p>
        </div>

        <div className="mono-card mono-card-hover rounded-2xl p-6 shadow-sm border border-slate-800 space-y-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-white">Emergency Tele-Doctor WebRTC</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Critical RED triage alerts trigger instant emergency notifications to regional doctors in Addis Ababa, Adama, or Mekelle, opening a live WebRTC video consultation room.
          </p>
        </div>

      </div>

      {/* GitHub Student Developer Pack Tools Matrix */}
      <div className="mono-card rounded-2xl p-7 shadow-md border border-slate-800 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-[11px] font-semibold text-slate-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>FULL PRODUCTION STACK & DEVELOPER PACK ARCHITECTURE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">GitHub Student Developer Pack & Google AI Ecosystem</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs font-semibold text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">MongoDB Atlas</span>
              <span className="text-[10px] text-slate-500">MERN Cloud Database</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">Google Gemini AI</span>
              <span className="text-[10px] text-slate-500">Multimodal Speech & Vision</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">Appwrite Cloud</span>
              <span className="text-[10px] text-slate-500">BaaS Storage & Realtime</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">Clerk Identity</span>
              <span className="text-[10px] text-slate-500">Multi-Role User Auth</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">Stripe Sandbox</span>
              <span className="text-[10px] text-slate-500">Tele-Doctor Billing Logs</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">Testmail.app</span>
              <span className="text-[10px] text-slate-500">Emergency Alert Testing</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">ToDiagram</span>
              <span className="text-[10px] text-slate-500">Referral Flow Schemas</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="block font-bold text-slate-200">DigitalOcean</span>
              <span className="text-[10px] text-slate-500">Cloud App Platform</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
