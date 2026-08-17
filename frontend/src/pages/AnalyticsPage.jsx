import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SchemaVisualizer from '../components/SchemaVisualizer';
import { BarChart3, ShieldAlert, Activity, Users, Globe, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function AnalyticsPage({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [metrics, setMetrics] = useState({
    totalCases: 14,
    redCritical: 4,
    yellowUrgent: 7,
    greenRoutine: 3,
    languageBreakdown: { amharic: 8, oromo: 4, tigrinya: 2 }
  });

  useEffect(() => {
    axios
      .get('/api/analytics/summary')
      .then((res) => {
        if (res.data.success) {
          setMetrics(res.data.metrics);
        }
      })
      .catch((err) => console.warn('Analytics fetch error:', err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-extrabold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ETHIOPIAN MINISTRY OF HEALTH • REGIONAL REFERRAL DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.analyticsPortal}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Real-time analytics on health extension triage cases across regional health posts in Ethiopia, local language distribution, and referral node schemas.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">TOTAL CASES</span>
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{metrics.totalCases}</p>
          <span className="text-[10px] text-teal-400 font-semibold">● Live Sync with MongoDB</span>
        </div>

        <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300">RED CRITICAL</span>
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 mt-2">{metrics.redCritical}</p>
          <span className="text-[10px] text-rose-400 font-semibold">Immediate Doctor Video Required</span>
        </div>

        <div className="bg-slate-900 border border-amber-900/60 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">YELLOW URGENT</span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-2">{metrics.yellowUrgent}</p>
          <span className="text-[10px] text-amber-400 font-semibold">Health Center within 24-48h</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">LANGUAGE BREAKDOWN</span>
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="mt-2 text-xs space-y-1 text-slate-300">
            <div className="flex justify-between">
              <span>Amharic (አማርኛ):</span>
              <span className="font-bold text-emerald-400">{metrics.languageBreakdown.amharic}</span>
            </div>
            <div className="flex justify-between">
              <span>Afaan Oromoo:</span>
              <span className="font-bold text-teal-400">{metrics.languageBreakdown.oromo}</span>
            </div>
            <div className="flex justify-between">
              <span>Tigrinya (ትግርኛ):</span>
              <span className="font-bold text-amber-400">{metrics.languageBreakdown.tigrinya}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive ToDiagram Schema Visualizer */}
      <SchemaVisualizer />
    </div>
  );
}
