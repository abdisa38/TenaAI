import React, { useState } from 'react';
import axios from 'axios';
import VoiceRecorder from '../components/VoiceRecorder';
import ImageUploader from '../components/ImageUploader';
import TriageResultCard from '../components/TriageResultCard';
import WebRTCRoom from '../components/WebRTCRoom';
import { LANGUAGES } from '../utils/languages';
import { Activity, User, MapPin, Sparkles, Send, Stethoscope, ShieldCheck, HeartPulse, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HEWHome({ currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Female');
  const [woredaZone, setWoredaZone] = useState('East Shoa, Oromia');

  const [audioBlob, setAudioBlob] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [textNote, setTextNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [triageResult, setTriageResult] = useState(null);
  const [activeCallCaseId, setActiveCallCaseId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Please enter patient name.');
      return;
    }

    setIsSubmitting(true);
    setTriageResult(null);

    const formData = new FormData();
    formData.append('patientName', patientName);
    formData.append('patientAge', patientAge || 25);
    formData.append('patientGender', patientGender);
    formData.append('primaryLanguage', currentLang);
    formData.append('woredaZone', woredaZone);
    formData.append('textNote', textNote);

    if (audioBlob) {
      formData.append('audio', audioBlob, 'voice-symptoms.webm');
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await axios.post('/api/triage/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setTriageResult(res.data.case);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Triage submission error:', err);
      alert('Triage processing failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-2 sm:px-4">
      
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-amber-500/15 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-black text-teal-300 shadow-md">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">Ethiopian Rural Health Extension Triage Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-ethiopic leading-tight">
            {t.welcome}
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-medium font-ethiopic">
            {t.subtitle}
          </p>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Offline-First Sync</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs text-slate-300">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Multilingual Speech & Vision</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs text-slate-300">
              <Stethoscope className="w-4 h-4 text-rose-400" />
              <span>Direct Tele-Doctor Escalation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form vs Diagnostic Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Triage Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Demographic Details */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-black text-teal-400 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 mr-1" />
              <span>Patient Demographic Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={t.patientNamePlaceholder}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder={t.patientAgePlaceholder}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner cursor-pointer"
                >
                  <option value="Female" className="bg-slate-950">Female</option>
                  <option value="Male" className="bg-slate-950">Male</option>
                  <option value="Child/Other" className="bg-slate-950">Child / Infant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Woreda / Health Zone</label>
                <input
                  type="text"
                  value={woredaZone}
                  onChange={(e) => setWoredaZone(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Voice Input Component */}
          <VoiceRecorder currentLang={currentLang} onAudioCaptured={setAudioBlob} />

          {/* Vision Image Upload Component */}
          <ImageUploader currentLang={currentLang} onImageCaptured={setImageFile} />

          {/* Field Notes Text Input */}
          <div className="glass-panel rounded-3xl p-6 shadow-2xl">
            <label className="block text-xs font-bold text-slate-400 mb-2">
              Additional HEW Field Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="e.g. Patient has high temperature, persistent coughing for 3 days..."
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors shadow-inner font-medium"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black py-4 px-6 rounded-2xl shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-3 glow-teal"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span className="font-ethiopic">{t.analyzing}</span>
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="text-base font-ethiopic">{t.submitTriage}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Diagnostic Output Card */}
        <div>
          {triageResult ? (
            <TriageResultCard
              triageCase={triageResult}
              currentLang={currentLang}
              onStartVideoCall={(caseId) => setActiveCallCaseId(caseId)}
            />
          ) : (
            <div className="h-full min-h-[440px] glass-panel border-dashed border-slate-800/80 rounded-3xl flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-xl glow-teal">
                <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">No Active Triage Result Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Record patient symptoms via native voice audio or take a wound photo, then tap "Start Gemini AI Diagnostics".
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* WebRTC Video Consultation Modal Room */}
      {activeCallCaseId && (
        <WebRTCRoom caseId={activeCallCaseId} onEndCall={() => setActiveCallCaseId(null)} />
      )}
    </div>
  );
}
