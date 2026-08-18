import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Volume2, Video, FileText } from 'lucide-react';
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

  const isRed = triageUrgency === 'RED';

  return (
    <div className="mono-card border rounded-2xl p-6 shadow-md space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl border ${
            isRed ? 'bg-rose-950/60 border-rose-800 text-rose-300' : 'bg-slate-900 border-slate-700 text-white'
          }`}>
            {isRed ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400">CASE #{caseId}</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                isRed ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-slate-900 text-slate-200 border-slate-700'
              }`}>
                SCORE: {urgencyScore} / 100 ({triageUrgency})
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{patientName}</h2>
          </div>
        </div>

        {/* Video Tele-Doctor Action Button for RED / High Urgency */}
        {triageUrgency === 'RED' && (
          <button
            type="button"
            onClick={() => onStartVideoCall && onStartVideoCall(caseId)}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
          >
            <Video className="w-4 h-4" />
            <span>{t.connectDoctor}</span>
          </button>
        )}
      </div>

      {/* Spoken Native Audio Button */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-3 pr-2">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-white' : ''}`} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.listenNativeAdvice}</h4>
            <p className="text-xs text-slate-400 italic mt-0.5">"{nativeAudioInstructionText}"</p>
          </div>
        </div>
        <button
          type="button"
          onClick={speakNativeInstruction}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all shrink-0"
        >
          <span>{isPlayingAudio ? 'Speaking...' : 'Play Audio 🔊'}</span>
        </button>
      </div>

      {/* Red Flags List */}
      {redFlags && redFlags.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            <span>Identified Clinical Red Flags</span>
          </h4>
          <ul className="space-y-1 text-xs text-slate-400">
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Standardized SOAP Notes for Doctors */}
      <div className="bg-slate-950 rounded-xl p-4.5 border border-slate-800 space-y-3 shadow-inner">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
          <FileText className="w-4 h-4 mr-2 text-slate-400" />
          <span>Standardized Clinical SOAP Note (Google Gemini AI)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Subjective (Symptoms)</span>
            <p className="text-slate-400 leading-relaxed">{soapNotes?.subjective || translatedSymptomsEnglish}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Objective (Signs & Photos)</span>
            <p className="text-slate-400 leading-relaxed">{soapNotes?.objective || 'Vitals & clinical presentation evaluated.'}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Assessment</span>
            <p className="text-slate-400 leading-relaxed">{soapNotes?.assessment}</p>
          </div>

          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">Plan / Action Steps</span>
            <p className="text-slate-400 leading-relaxed">{soapNotes?.plan}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
