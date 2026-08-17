import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope, Video, Clock, CheckCircle, ShieldAlert, User, MapPin, RefreshCw, CreditCard } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function DoctorQueue({ currentLang = 'amharic', onStartVideoCall }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/doctor/queue');
      if (res.data.success) {
        setQueue(res.data.queue);
      }
    } catch (err) {
      console.warn('Queue fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000); // Polling queue
    return () => clearInterval(interval);
  }, []);

  const handleClaimCase = async (caseId) => {
    setClaimingId(caseId);
    try {
      const res = await axios.post(`/api/doctor/claim/${caseId}`, {
        doctorName: 'Dr. Abebe Bekele (Black Lion Hospital)'
      });
      if (res.data.success) {
        fetchQueue();
        if (onStartVideoCall) {
          onStartVideoCall(caseId);
        }
      }
    } catch (err) {
      console.error('Claim case error:', err);
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <Stethoscope className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{t.doctorPortal}</h2>
            <p className="text-xs text-slate-400">Prioritized Emergency Tele-Consultation Queue</p>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchQueue}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {loading && queue.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading active cases from MongoDB Atlas...</div>
      ) : queue.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No active emergency cases in queue right now.</div>
      ) : (
        <div className="space-y-4">
          {queue.map((item) => {
            const isRed = item.triageUrgency === 'RED';
            return (
              <div
                key={item.caseId}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isRed
                    ? 'bg-rose-950/40 border-rose-600/80 shadow-rose-950/50 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      isRed ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.triageUrgency} ({item.urgencyScore}/100)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">#{item.caseId}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-200">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="font-bold">{item.patientName}</span>
                    <span className="text-xs text-slate-400">({item.patientAge} y/o, {item.patientGender})</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{item.woredaZone}</span>
                    <span className="mx-1">•</span>
                    <span>HEW: {item.hewName}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 max-w-xl">
                    <strong className="text-teal-400">Symptoms: </strong>{item.translatedSymptomsEnglish}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleClaimCase(item.caseId)}
                    disabled={claimingId === item.caseId}
                    className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
                      isRed
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse-red'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{claimingId === item.caseId ? 'Connecting...' : 'Claim & Tele-Doctor Call'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
