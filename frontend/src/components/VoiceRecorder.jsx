import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, CheckCircle2, Radio } from 'lucide-react';
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
    <div className="mono-card rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <Mic className="w-5 h-5 text-slate-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-ethiopic">{t.recordVoiceInstruction}</h3>
            <p className="text-xs text-slate-400">Speech-to-Text AI Triage • Amharic, Oromo, Tigrinya</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 flex items-center space-x-1">
          <Radio className="w-3 h-3 text-slate-400" />
          <span>AUDIO ENGINE</span>
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-4 space-y-6">
        
        {/* Pulsing Mic Waveform Visualizer Trigger */}
        <div className="relative flex items-center justify-center">
          {isRecording && (
            <div className="absolute w-28 h-28 rounded-full border border-slate-700 animate-ping-subtle"></div>
          )}

          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 shadow-lg hover:border-slate-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
            >
              <Mic className="w-8 h-8 text-slate-200 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-slate-900 border border-rose-700 shadow-lg animate-pulse flex items-center justify-center hover:scale-105 transition-all"
            >
              <Square className="w-7 h-7 text-rose-500 fill-rose-500" />
            </button>
          )}
        </div>

        {/* Dynamic Waveform Frequency Bars */}
        {isRecording ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-end justify-center space-x-1 h-7">
              <div className="w-1 bg-slate-400 rounded-full animate-wave-1"></div>
              <div className="w-1 bg-slate-300 rounded-full animate-wave-2"></div>
              <div className="w-1 bg-slate-100 rounded-full animate-wave-3"></div>
              <div className="w-1 bg-slate-400 rounded-full animate-wave-4"></div>
              <div className="w-1 bg-slate-300 rounded-full animate-wave-5"></div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 px-3.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>{t.recording} ({formatTime(recordingTime)})</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">Tap microphone icon to speak symptoms</p>
        )}
      </div>

      {/* Captured Audio Preview Card */}
      {audioUrl && !isRecording && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Voice Input Captured</span>
          </div>
          <audio controls src={audioUrl} className="h-7 max-w-[180px]" />
        </div>
      )}
    </div>
  );
}
