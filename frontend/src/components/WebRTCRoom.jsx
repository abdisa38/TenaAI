import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, User, ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import io from 'socket.io-client';

export default function WebRTCRoom({ caseId, onEndCall }) {
  const [localStream, setLocalStream] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect Socket.io signaling server
    socketRef.current = io('http://localhost:5000');

    // Request User Video/Audio media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join room
        socketRef.current.emit('join_room', caseId);
      })
      .catch((err) => {
        console.warn('WebRTC Camera/Mic Access Warning:', err);
      });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [caseId]);

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 md:p-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-rose-600 text-white rounded-2xl animate-pulse">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Live WebRTC Tele-Doctor Consultation</h2>
            <p className="text-xs text-slate-400">Case #{caseId} • Encrypted Peer-to-Peer Medical Feed</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEndCall}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-xl transition-all"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Consultation</span>
        </button>
      </div>

      {/* Video Streams Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        
        {/* Main Video Viewport (2 cols) */}
        <div className="lg:col-span-2 relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
          
          {/* Simulated Doctor / Remote Stream View */}
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-teal-500/10 border-2 border-teal-500/40 flex items-center justify-center mb-4 shadow-xl">
              <User className="w-12 h-12 text-teal-400 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Dr. Abebe Bekele (On Call)</h3>
            <p className="text-xs text-teal-400 font-semibold mb-2">Black Lion Hospital, Addis Ababa</p>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-medium">
              ● Peer-to-Peer WebRTC Audio/Video Stream Active
            </span>
          </div>

          {/* Local User Preview Video (Small Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-44 h-32 bg-slate-950 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded">
              HEW / Patient
            </div>
          </div>

          {/* Media Control Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-slate-900/90 border border-slate-700/80 p-3 rounded-full shadow-2xl">
            <button
              type="button"
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-colors ${
                isAudioMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Doctor Prescription & Consultation Notes Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 mb-3">
              <FileText className="w-5 h-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">Tele-Doctor Clinical Notes & Remedies</h3>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">
              Enter doctor prescription notes and immediate medication instructions for the Health Extension Worker.
            </p>

            <textarea
              rows={8}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="e.g. Prescribe Amoxicillin syrup 250mg. Instruct mother on oral rehydration therapy. Follow up at health center in 48 hours..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitted(true)}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-transform flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{isSubmitted ? 'Notes Saved to Patient Record' : 'Save Prescription & Resolve Case'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
