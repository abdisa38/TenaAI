import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HEWHome from './pages/HEWHome';
import DoctorDashboard from './pages/DoctorDashboard';
import AnalyticsPage from './pages/AnalyticsPage';

export default function App() {
  const [currentLang, setCurrentLang] = useState('amharic');

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
        {/* Navigation Bar */}
        <Navbar currentLang={currentLang} setLanguage={setCurrentLang} />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<LandingPage currentLang={currentLang} />} />
            <Route path="/hew-triage" element={<HEWHome currentLang={currentLang} />} />
            <Route path="/doctor-queue" element={<DoctorDashboard currentLang={currentLang} />} />
            <Route path="/analytics" element={<AnalyticsPage currentLang={currentLang} />} />
          </Routes>
        </main>

        {/* Ethiopian Flag Footer Bar */}
        <footer className="bg-slate-900/80 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-500 font-bold">🟢</span>
              <span className="text-amber-400 font-bold">🟡</span>
              <span className="text-rose-500 font-bold">🔴</span>
              <span className="text-slate-300 font-semibold">Tena AI (ጤና AI)</span>
              <span>• Engineered for Ethiopian Society</span>
            </div>
            <p>Powered by Google Gemini 2.0 Multimodal AI & MERN Stack</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
