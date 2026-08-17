import React, { useState } from 'react';
import DoctorQueue from '../components/DoctorQueue';
import WebRTCRoom from '../components/WebRTCRoom';
import { Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function DoctorDashboard({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [activeCallCaseId, setActiveCallCaseId] = useState(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-extrabold text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REGIONAL TELE-DOCTOR EMERGENCY NETWORK</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t.doctorPortal}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Review high-priority RED triage cases dispatched from rural Health Extension Workers in Amharic, Afaan Oromoo, and Tigrinya. Claim cases to start WebRTC video sessions.
          </p>
        </div>
      </div>

      {/* Main Doctor Queue Component */}
      <DoctorQueue
        currentLang={currentLang}
        onStartVideoCall={(caseId) => setActiveCallCaseId(caseId)}
      />

      {/* Active WebRTC Video Consultation Room */}
      {activeCallCaseId && (
        <WebRTCRoom caseId={activeCallCaseId} onEndCall={() => setActiveCallCaseId(null)} />
      )}
    </div>
  );
}
