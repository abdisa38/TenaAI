import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Volume2, Video, FileText, Activity, HeartPulse, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function TriageResultCard({ triageCase, currentLang = 'amharic', onStartVideoCall }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!triageCase) return null;

  const {
    caseId,
    patientName,
    triageUrgency,
    urgencyScore,
    rawAudioTranscript,
    translatedSymptomsEnglish,
    soapNotes,
    redFlags,
    nativeAudioInstructionText
  } = triageCase;

  // Speak native language audio instruction using Web Speech Synthesis API
  const speakNativeInstruction = () => {
    if (!nativeAudioInstructionText) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(nativeAudioInstructionText);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(nativeAudioInstructionText);
    }
  };

  const getUrgencyConfig = () => {
    switch (triageUrgency) {
      case 'RED':
        return {
          cardBg: 'bg-rose-950/40 border-rose-600/80 shadow-rose-950/50 glow-rose',
          badgeBg: 'bg-rose-600 text-white',
          title: t.redCritical,
          icon: ShieldAlert,
          accentColor: 'text-rose-400'
        };
      case 'YELLOW':
        return {
          cardBg: 'bg-amber-950/40 border-amber-600/80 shadow-amber-950/50 glow-amber',
          badgeBg: 'bg-amber-500 text-slate-950 font-black',
          title: t.yellowUrgent,
          icon: AlertTriangle,
          accentColor: 'text-amber-400'
        };
      default:
        return {
          cardBg: 'bg-emerald-950/40 border-emerald-600/80 shadow-emerald-950/50 glow-emerald',
          badgeBg: 'bg-emerald-600 text-white',
          title: t.greenRoutine,
          icon: CheckCircle2,
          accentColor: 'text-emerald-400'
        };
    }
  };

  const urgency = getUrgencyConfig();
  const IconComponent = urgency.icon;

  return (
    <div className={`glass-panel border rounded-3xl p-6 shadow-2xl space-y-6 transition-all ${urgency.cardBg}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className={`p-3.5 rounded-2xl ${urgency.badgeBg} shadow-lg`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400">CASE #{caseId}</span>
              <span className={`text-xs font-black px-3 py-0.5 rounded-full ${urgency.badgeBg}`}>
                SCORE: {urgencyScore} / 100
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{patientName}</h2>
          </div>
        </div>

        {/* Video Tele-Doctor Action Button for RED / High Urgency */}
        {triageUrgency === 'RED' && (
          <button
            type="button"
            onClick={() => onStartVideoCall && onStartVideoCall(caseId)}
            className="flex items-center space-x-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition-transform hover:scale-105 glow-rose animate-pulse"
          >
            <Video className="w-5 h-5" />
            <span className="text-sm">{t.connectDoctor}</span>
          </button>
        )}
      </div>

      {/* Spoken Native Audio Button */}
      <div className="bg-slate-950/80 border border-slate-800 p-4.5 rounded-2xl flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-3.5 pr-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce text-emerald-300' : ''}`} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">{t.listenNativeAdvice}</h4>
            <p className="text-xs text-slate-300 font-medium italic mt-0.5">"{nativeAudioInstructionText}"</p>
          </div>
        </div>
        <button
          type="button"
          onClick={speakNativeInstruction}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-lg transition-all shrink-0 flex items-center space-x-1"
        >
          <span>{isPlayingAudio ? 'Speaking...' : 'Play Audio 🔊'}</span>
        </button>
      </div>

      {/* Red Flags List */}
      {redFlags && redFlags.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-900/60 p-4.5 rounded-2xl">
          <h4 className="text-xs font-black text-rose-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Identified Clinical Red Flags</span>
          </h4>
          <ul className="grid grid-cols-1 gap-1.5 text-xs text-rose-200 font-semibold">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Standardized SOAP Notes for Doctors */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
        <h4 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          <span>Standardized Clinical SOAP Note (Google Gemini AI)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
            <span className="font-bold text-amber-300 block mb-1">Subjective (Symptoms)</span>
            <p className="text-slate-300 font-medium leading-relaxed">{soapNotes?.subjective || translatedSymptomsEnglish}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
            <span className="font-bold text-teal-300 block mb-1">Objective (Signs & Photos)</span>
            <p className="text-slate-300 font-medium leading-relaxed">{soapNotes?.objective || 'Vitals & clinical presentation evaluated.'}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
            <span className="font-bold text-indigo-300 block mb-1">Assessment</span>
            <p className="text-slate-300 font-medium leading-relaxed">{soapNotes?.assessment}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/80">
            <span className="font-bold text-emerald-300 block mb-1">Plan / Action Steps</span>
            <p className="text-slate-300 font-medium leading-relaxed">{soapNotes?.plan}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
