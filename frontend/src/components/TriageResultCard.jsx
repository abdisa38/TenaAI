import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Volume2, Video, FileText, Activity } from 'lucide-react';
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

      // Select suitable voice if available
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert(nativeAudioInstructionText);
    }
  };

  const getUrgencyBadge = () => {
    switch (triageUrgency) {
      case 'RED':
        return {
          bg: 'bg-rose-950/80 border-rose-600/80 text-rose-200',
          badge: 'bg-rose-600 text-white',
          title: t.redCritical,
          icon: ShieldAlert
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/80 border-amber-600/80 text-amber-200',
          badge: 'bg-amber-500 text-slate-950',
          title: t.yellowUrgent,
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-emerald-950/80 border-emerald-600/80 text-emerald-200',
          badge: 'bg-emerald-600 text-white',
          title: t.greenRoutine,
          icon: CheckCircle2
        };
    }
  };

  const urgencyConfig = getUrgencyBadge();
  const IconComponent = urgencyConfig.icon;

  return (
    <div className={`border rounded-3xl p-6 shadow-2xl space-y-6 ${urgencyConfig.bg}`}>
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-2xl ${urgencyConfig.badge}`}>
            <IconComponent className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400">#{caseId}</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${urgencyConfig.badge}`}>
                SCORE: {urgencyScore} / 100
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">{patientName}</h2>
          </div>
        </div>

        {/* Video Tele-Doctor Action Button for RED / High Urgency */}
        {triageUrgency === 'RED' && (
          <button
            type="button"
            onClick={() => onStartVideoCall && onStartVideoCall(caseId)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform animate-pulse-red"
          >
            <Video className="w-5 h-5" />
            <span>{t.connectDoctor}</span>
          </button>
        )}
      </div>

      {/* Spoken Native Audio Button */}
      <div className="bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'text-emerald-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">{t.listenNativeAdvice}</h4>
            <p className="text-xs text-slate-400 italic">"{nativeAudioInstructionText}"</p>
          </div>
        </div>
        <button
          type="button"
          onClick={speakNativeInstruction}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1"
        >
          <span>{isPlayingAudio ? 'Playing...' : 'Play Audio'}</span>
        </button>
      </div>

      {/* Red Flags List */}
      {redFlags && redFlags.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <ShieldAlert className="w-4 h-4 text-rose-400 mr-1" />
            Identified Clinical Red Flags
          </h4>
          <ul className="list-disc list-inside space-y-1 text-xs text-rose-200">
            {redFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Standardized SOAP Notes for Doctors */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center">
          <FileText className="w-4 h-4 mr-1.5" />
          Standardized Medical SOAP Note (Gemini AI Transcribed)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-300 block mb-1">Subjective (Symptoms)</span>
            <p className="text-slate-300">{soapNotes?.subjective || translatedSymptomsEnglish}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-teal-300 block mb-1">Objective (Signs & Photos)</span>
            <p className="text-slate-300">{soapNotes?.objective || 'Vitals and image inspected.'}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-indigo-300 block mb-1">Assessment</span>
            <p className="text-slate-300">{soapNotes?.assessment}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-300 block mb-1">Plan / Action Steps</span>
            <p className="text-slate-300">{soapNotes?.plan}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
