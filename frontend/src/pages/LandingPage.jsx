import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mic, Camera, Stethoscope, Globe, ShieldAlert, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function LandingPage({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  return (
    <div className="space-y-16 py-8 max-w-6xl mx-auto">
      
      {/* Hero Showcase Section */}
      <div className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-teal-500/30 px-4 py-1.5 rounded-full text-xs font-bold text-teal-300 shadow-xl">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>STARTUP INNOVATION FOR ETHIOPIA & EAST AFRICA</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Multilingual AI Medical Triage & Tele-Diagnostics Network for <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Ethiopian Society</span>
        </h1>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Overcoming language & literacy barriers in rural Ethiopian health posts. Speak symptoms in <strong className="text-emerald-400">Amharic (አማርኛ)</strong>, <strong className="text-teal-400">Afaan Oromoo</strong>, or <strong className="text-amber-400">Tigrinya (ትግርኛ)</strong>, or upload wound photos for instant Gemini AI clinical triage and doctor video calls.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/hew-triage"
            className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold px-8 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform text-base"
          >
            <Mic className="w-5 h-5" />
            <span>Try Voice AI Triage Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            to="/doctor-queue"
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold px-6 py-4 rounded-2xl transition-all text-base shadow-xl"
          >
            <Stethoscope className="w-5 h-5 text-rose-400" />
            <span>Open Tele-Doctor Queue</span>
          </Link>
        </div>
      </div>

      {/* 3 Core pillars: Voice, Vision, WebRTC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Mic className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-lg font-extrabold text-white">Voice-First Local Dialects</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Health Extension Workers record native speech in Amharic, Afaan Oromoo, or Tigrinya. Gemini 2.0 Flash processes the audio directly without requiring manual text entry.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Camera className="w-6 h-6 text-teal-400" />
          </div>
          <h3 className="text-lg font-extrabold text-white">Multimodal Vision Diagnostics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Snap photos of open wounds, skin rashes, burns, or eye infections. Gemini Vision AI identifies clinical indicators and scores emergency urgency.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="text-lg font-extrabold text-white">Emergency Tele-Doctor WebRTC</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Critical RED triage alerts trigger instant emergency email dispatches to regional doctors in Addis Ababa, Adama, or Mekelle, opening a live WebRTC video consultation room.
          </p>
        </div>

      </div>

      {/* GitHub Student Developer Pack + Google AI Tools Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Powered by GitHub Student Developer Pack & Google AI</h2>
          <p className="text-xs text-slate-400">Architectural integration matrix leveraging all package developer tools</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-300">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>MongoDB Atlas (MERN)</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Google Gemini AI Engine</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Appwrite Cloud BaaS</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Clerk Identity & Auth</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Stripe Payment Sandbox</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Testmail.app Emergency Email</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>ToDiagram Visual Schemas</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>DigitalOcean App Platform</span>
          </div>
        </div>
      </div>

    </div>
  );
}
