import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Volume2, Sparkles, Radio, CheckCircle2 } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function VoiceRecorder({ onAudioCaptured, currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (onAudioCaptured) {
          onAudioCaptured(audioBlob);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access error:', err);
      alert('Microphone permission required to record patient symptoms.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl glow-rose">
            <Mic className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-ethiopic">{t.recordVoiceInstruction}</h3>
            <p className="text-xs text-slate-400">Speech-to-Text AI Triage • Amharic, Oromo, Tigrinya</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center space-x-1">
          <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
          <span>AUDIO ENGINE</span>
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-4 space-y-6">
        
        {/* Pulsing Mic Waveform Visualizer Trigger */}
        <div className="relative flex items-center justify-center">
          {isRecording && (
            <div className="absolute w-32 h-32 rounded-full border-2 border-rose-500/40 animate-ping-slow"></div>
          )}

          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-1 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group glow-rose"
            >
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Mic className="w-10 h-10 text-rose-500 group-hover:text-rose-400 transition-colors" />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-rose-600 p-1 shadow-2xl animate-pulse flex items-center justify-center hover:scale-105 transition-all glow-rose"
            >
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Square className="w-9 h-9 text-rose-500 fill-rose-500" />
              </div>
            </button>
          )}
        </div>

        {/* Dynamic Waveform Frequency Bars */}
        {isRecording ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-end justify-center space-x-1.5 h-8">
              <div className="w-1.5 bg-rose-500 rounded-full animate-wave-1"></div>
              <div className="w-1.5 bg-rose-400 rounded-full animate-wave-2"></div>
              <div className="w-1.5 bg-amber-400 rounded-full animate-wave-3"></div>
              <div className="w-1.5 bg-rose-500 rounded-full animate-wave-4"></div>
              <div className="w-1.5 bg-rose-300 rounded-full animate-wave-5"></div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-bold text-rose-300 bg-rose-950/80 border border-rose-800/80 px-4 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{t.recording} ({formatTime(recordingTime)})</span>
            </div>
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-400">Tap microphone icon to speak symptoms</p>
        )}
      </div>

      {/* Captured Audio Preview Card */}
      {audioUrl && !isRecording && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-300 block">Voice Input Captured</span>
              <span className="text-[10px] text-slate-400">Ready for Gemini AI Audio Analysis</span>
            </div>
          </div>
          <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
        </div>
      )}
    </div>
  );
}
