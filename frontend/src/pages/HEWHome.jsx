import React, { useState } from 'react';
import axios from 'axios';
import VoiceRecorder from '../components/VoiceRecorder';
import ImageUploader from '../components/ImageUploader';
import TriageResultCard from '../components/TriageResultCard';
import WebRTCRoom from '../components/WebRTCRoom';
import { LANGUAGES } from '../utils/languages';
import { Activity, User, MapPin, Sparkles, Send, Stethoscope } from 'lucide-react';
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
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Triage submission error:', err);
      alert('Triage processing failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-extrabold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ETHIOPIAN RURAL HEALTH EXTENSION PORTAL</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {t.welcome}
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Form Inputs vs AI Triage Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Triage Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Profile Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 mr-1.5" />
              Patient Demographic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={t.patientNamePlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder={t.patientAgePlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Child/Other">Child / Infant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Woreda / Health Zone</label>
                <input
                  type="text"
                  value={woredaZone}
                  onChange={(e) => setWoredaZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Voice Input Component */}
          <VoiceRecorder currentLang={currentLang} onAudioCaptured={setAudioBlob} />

          {/* Vision Image Upload Component */}
          <ImageUploader currentLang={currentLang} onImageCaptured={setImageFile} />

          {/* Optional Text Note */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Additional HEW Field Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="e.g. Patient has high temperature, persistent coughing for 3 days..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{t.analyzing}</span>
              </span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="text-base">{t.submitTriage}</span>
              </>
            )}
          </button>
        </form>

        {/* Right Column: Triage Diagnostic Result */}
        <div>
          {triageResult ? (
            <TriageResultCard
              triageCase={triageResult}
              currentLang={currentLang}
              onStartVideoCall={(caseId) => setActiveCallCaseId(caseId)}
            />
          ) : (
            <div className="h-full min-h-[400px] bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4">
                <Activity className="w-10 h-10 text-teal-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-300">No Active AI Triage Result Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Record patient symptoms via native voice audio or take a wound photo, then tap "Start Gemini AI Diagnostics".
              </p>
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
