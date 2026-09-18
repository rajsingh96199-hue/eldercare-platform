import React from 'react';
import { useSeniorMode } from '../contexts/SeniorModeContext';
import { Eye, Type, Volume2, Sparkles } from 'lucide-react';

export const SeniorModeControls: React.FC = () => {
  const {
    isSeniorMode,
    toggleSeniorMode,
    textSize,
    setTextSize,
    isHighContrast,
    toggleHighContrast,
    speakText,
  } = useSeniorMode();

  return (
    <div className="bg-teal-900 text-teal-50 px-4 py-1.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-semibold text-teal-100 hidden sm:inline">Senior Accessibility Mode:</span>
          <button
            onClick={toggleSeniorMode}
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
              isSeniorMode
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-teal-800 text-teal-200 hover:bg-teal-700'
            }`}
          >
            {isSeniorMode ? '✓ Senior Mode Active' : 'Enable Easy Read Mode'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Text Size Selectors */}
          <div className="flex items-center gap-1 bg-teal-950/60 p-0.5 rounded-lg border border-teal-800/60">
            <span className="text-[10px] text-teal-300 px-1 font-medium flex items-center gap-0.5">
              <Type className="w-3 h-3" /> Size:
            </span>
            <button
              onClick={() => setTextSize('standard')}
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                textSize === 'standard' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:text-white'
              }`}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-1.5 py-0.5 rounded text-sm font-bold ${
                textSize === 'large' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:text-white'
              }`}
              title="Large Font Size (Recommended for Seniors)"
            >
              A+
            </button>
            <button
              onClick={() => setTextSize('xl')}
              className={`px-1.5 py-0.5 rounded text-base font-extrabold ${
                textSize === 'xl' ? 'bg-teal-600 text-white' : 'text-teal-200 hover:text-white'
              }`}
              title="Extra Large Font Size"
            >
              A++
            </button>
          </div>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isHighContrast
                ? 'bg-white text-slate-950'
                : 'bg-teal-950/60 text-teal-200 hover:bg-teal-800 border border-teal-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isHighContrast ? 'High Contrast: ON' : 'High Contrast'}</span>
          </button>

          {/* Audio read */}
          <button
            onClick={() =>
              speakText(
                'Welcome to ElderCare. We connect families with verified home nurses, caregivers, and physiotherapists for trusted elderly care.'
              )
            }
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-950/60 text-teal-200 hover:bg-teal-800 border border-teal-800/60 transition-colors"
            title="Read Page Summary"
          >
            <Volume2 className="w-3.5 h-3.5 text-teal-300" />
            <span className="hidden md:inline">Listen</span>
          </button>
        </div>
      </div>
    </div>
  );
};
