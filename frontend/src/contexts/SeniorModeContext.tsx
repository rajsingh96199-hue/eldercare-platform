import React, { createContext, useContext, useState, useEffect } from 'react';

type TextSize = 'standard' | 'large' | 'xl';

interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  speakText: (text: string) => void;
}

const SeniorModeContext = createContext<SeniorModeContextType | undefined>(undefined);

export const SeniorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    return localStorage.getItem('eldercare_senior_mode') === 'true';
  });

  const [textSize, setTextSize] = useState<TextSize>(() => {
    return (localStorage.getItem('eldercare_text_size') as TextSize) || 'standard';
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('eldercare_high_contrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('eldercare_senior_mode', String(isSeniorMode));
    if (isSeniorMode) {
      document.documentElement.classList.add('senior-mode');
      if (textSize === 'standard') setTextSize('large');
    } else {
      document.documentElement.classList.remove('senior-mode');
    }
  }, [isSeniorMode]);

  useEffect(() => {
    localStorage.setItem('eldercare_text_size', textSize);
    document.documentElement.classList.remove('text-size-standard', 'text-size-large', 'text-size-xl');
    document.documentElement.classList.add(`text-size-${textSize}`);
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('eldercare_high_contrast', String(isHighContrast));
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const toggleSeniorMode = () => {
    setIsSeniorMode((prev) => !prev);
  };

  const toggleHighContrast = () => {
    setIsHighContrast((prev) => !prev);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for elderly comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <SeniorModeContext.Provider
      value={{
        isSeniorMode,
        toggleSeniorMode,
        textSize,
        setTextSize,
        isHighContrast,
        toggleHighContrast,
        speakText,
      }}
    >
      {children}
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = (): SeniorModeContextType => {
  const context = useContext(SeniorModeContext);
  if (!context) {
    throw new Error('useSeniorMode must be used within a SeniorModeProvider');
  }
  return context;
};
