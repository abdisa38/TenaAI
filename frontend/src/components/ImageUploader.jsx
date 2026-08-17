import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, Sparkles, Eye } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
          <Camera className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{t.uploadPhotoInstruction}</h3>
          <p className="text-xs text-slate-400">Visual Diagnostics (Skin Lesions, Wounds, Eye Infections)</p>
        </div>
      </div>

      {!imagePreview ? (
        <label className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 bg-slate-950/60 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
          <ImageIcon className="w-12 h-12 text-slate-500 group-hover:text-teal-400 group-hover:scale-110 transition-all mb-3" />
          <span className="text-sm font-semibold text-slate-300 group-hover:text-teal-300">
            Tap to open camera or upload photo
          </span>
          <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 group">
          <img src={imagePreview} alt="Wound diagnostic preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-rose-600 rounded-full text-white hover:bg-rose-700 transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-teal-950/80 border border-teal-600/60 text-teal-200 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-teal-300" />
            <span>Photo Ready for Gemini Vision AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
