import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, ScanLine, CheckCircle2 } from 'lucide-react';
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
    <div className="mono-card rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <Camera className="w-5 h-5 text-slate-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-ethiopic">{t.uploadPhotoInstruction}</h3>
            <p className="text-xs text-slate-400">Visual Vision AI • Skin Lesions, Burns, Wounds & Infections</p>
          </div>
        </div>

        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 flex items-center space-x-1">
          <ScanLine className="w-3 h-3 text-slate-400" />
          <span>VISION SCANNER</span>
        </span>
      </div>

      {!imagePreview ? (
        <label className="relative border border-dashed border-slate-800 hover:border-slate-600 bg-slate-950/80 rounded-2xl p-7 flex flex-col items-center justify-center cursor-pointer transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 group-hover:border-slate-600 transition-colors">
            <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </div>

          <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
            Tap to open camera or upload photo
          </span>
          <span className="text-[11px] text-slate-500 mt-1">PNG, JPG (Auto-analyzed by Gemini Vision AI)</span>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 group shadow-md">
          <img src={imagePreview} alt="Wound diagnostic preview" className="w-full h-52 object-cover" />
          
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
            <button
              type="button"
              onClick={removeImage}
              className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white hover:bg-slate-800 transition-colors shadow-lg flex items-center space-x-2 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span>Remove Photo</span>
            </button>
          </div>

          <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 text-slate-300 text-xs px-3 py-1 rounded-lg font-semibold flex items-center space-x-1.5 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Photo Attached</span>
          </div>
        </div>
      )}
    </div>
  );
}
