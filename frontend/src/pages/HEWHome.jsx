import React, { useState } from 'react';
import axios from 'axios';
import VoiceRecorder from '../components/VoiceRecorder';
import ImageUploader from '../components/ImageUploader';
import TriageResultCard from '../components/TriageResultCard';
import WebRTCRoom from '../components/WebRTCRoom';
import { LANGUAGES } from '../utils/languages';
import { Activity, User, Send, ShieldCheck, Stethoscope, Cpu } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-2 sm:px-4">
      
      {/* Header Banner */}
      <div className="mono-card rounded-2xl p-7 shadow-md relative overflow-hidden border border-slate-800">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700 px-3 py-1 rounded-md text-xs font-semibold text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-slate-300" />
            <span className="uppercase tracking-wider">Ethiopian Rural Health Extension Triage Hub</span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight font-ethiopic">
            {t.welcome}
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl leading-relaxed font-ethiopic">
            {t.subtitle}
          </p>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-xs text-slate-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              <span>Offline-First Sync</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-xs text-slate-400 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-300" />
              <span>Multilingual Speech & Vision</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-xs text-slate-400 flex items-center space-x-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-300" />
              <span>Tele-Doctor Escalation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form vs Diagnostic Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Triage Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Demographic Details */}
          <div className="mono-card rounded-2xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-400 mr-1" />
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 shadow-inner"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 shadow-inner cursor-pointer"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Voice Input Component */}
          <VoiceRecorder currentLang={currentLang} onAudioCaptured={setAudioBlob} />

          {/* Vision Image Upload Component */}
          <ImageUploader currentLang={currentLang} onImageCaptured={setImageFile} />

          {/* Field Notes Text Input */}
          <div className="mono-card rounded-2xl p-6 shadow-md">
            <label className="block text-xs font-bold text-slate-400 mb-2">
              Additional HEW Field Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={textNote}
              onChange={(e) => setTextNote(e.target.value)}
              placeholder="e.g. Patient has high temperature, persistent coughing for 3 days..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-slate-600 shadow-inner font-medium"
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-xs"
          >
            {isSubmitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                <span className="font-ethiopic">{t.analyzing}</span>
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="font-ethiopic text-xs">{t.submitTriage}</span>
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
            <div className="h-full min-h-[440px] mono-card border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                <Activity className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">No Active Triage Result Yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
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
