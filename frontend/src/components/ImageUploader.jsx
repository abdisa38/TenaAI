import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, Eye, ScanLine, CheckCircle2 } from 'lucide-react';
import { LANGUAGES } from '../utils/languages';

export default function ImageUploader({ onImageCaptured, currentLang = 'amharic' }) {
  const t = LANGUAGES[currentLang] || LANGUAGES.amharic;
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      if (onImageCaptured) {
        onImageCaptured(file);
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (onImageCaptured) {
      onImageCaptured(null);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl glow-teal">
            <Camera className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white font-ethiopic">{t.uploadPhotoInstruction}</h3>
            <p className="text-xs text-slate-400">Visual Vision AI • Skin Lesions, Burns, Wounds & Eye Infections</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-teal-300 flex items-center space-x-1">
          <ScanLine className="w-3 h-3 text-teal-400 animate-pulse" />
          <span>VISION SCANNER</span>
        </span>
      </div>

      {!imagePreview ? (
        <label className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/80 bg-slate-950/80 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group overflow-hidden shadow-inner">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-8 h-8 text-teal-400" />
          </div>

          <span className="text-sm font-extrabold text-slate-200 group-hover:text-teal-300 transition-colors">
            Tap to open camera or upload photo
          </span>
          <span className="text-xs text-slate-500 mt-1">Supports PNG, JPG (Auto-analyzed by Gemini Vision AI)</span>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-3xl overflow-hidden border border-teal-500/50 group scanner-hud shadow-2xl">
          <img src={imagePreview} alt="Wound diagnostic preview" className="w-full h-56 object-cover" />
          
          <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
            <button
              type="button"
              onClick={removeImage}
              className="p-3 bg-rose-600 rounded-2xl text-white hover:bg-rose-700 transition-colors shadow-2xl flex items-center space-x-2 font-bold text-xs"
            >
              <X className="w-5 h-5" />
              <span>Remove Photo</span>
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-teal-500/60 text-teal-200 text-xs px-3 py-1.5 rounded-xl font-extrabold flex items-center space-x-2 shadow-lg backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Image Attached for Gemini Vision AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
