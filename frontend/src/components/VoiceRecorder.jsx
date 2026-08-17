import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Volume2, Sparkles, AlertCircle } from 'lucide-react';
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
      // Stop all audio tracks
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
          <Mic className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{t.recordVoiceInstruction}</h3>
          <p className="text-xs text-slate-400">Supported: Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ)</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-6 space-y-4">
        {/* Pulsing Mic Button */}
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-1 shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center group"
          >
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center group-hover:bg-slate-900 transition-colors">
              <Mic className="w-10 h-10 text-rose-500 group-hover:text-rose-400 transition-colors" />
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="w-24 h-24 rounded-full bg-rose-600 p-1 shadow-2xl animate-pulse-red flex items-center justify-center hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
              <Square className="w-10 h-10 text-rose-500 fill-rose-500" />
            </div>
          </button>
        )}

        {/* Recording Status & Waveform */}
        {isRecording ? (
          <div className="flex items-center space-x-3 text-rose-400 font-semibold bg-rose-950/60 border border-rose-800/80 px-4 py-2 rounded-full">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
            <span>{t.recording} ({formatTime(recordingTime)})</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Tap to start voice recording</p>
        )}
      </div>

      {/* Audio Playback Preview */}
      {audioUrl && !isRecording && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Voice Recording Captured</span>
          </div>
          <audio controls src={audioUrl} className="h-8 max-w-[200px]" />
        </div>
      )}
    </div>
  );
}
