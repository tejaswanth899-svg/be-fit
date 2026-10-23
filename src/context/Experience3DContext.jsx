import { createContext, useContext, useState, useEffect } from 'react';
import { playClickSound, playHoverSound, playSwitchSound, playRepSuccessSound } from '../utils/audio';

export const THEME_CONFIGS = {
  blaze: {
    id: 'blaze',
    name: 'Blaze Solar',
    primary: '#ff6a2b',
    secondary: '#ff9a3d',
    primaryHex: 0xff6a2b,
    secondaryHex: 0xff9a3d,
    aura1: 'rgba(255, 106, 43, 0.22)',
    aura2: 'rgba(255, 154, 61, 0.16)',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Neon',
    primary: '#5ee7ff',
    secondary: '#9d4edd',
    primaryHex: 0x5ee7ff,
    secondaryHex: 0x9d4edd,
    aura1: 'rgba(94, 231, 255, 0.24)',
    aura2: 'rgba(157, 78, 221, 0.18)',
  },
  emerald: {
    id: 'emerald',
    name: 'Bio Matrix',
    primary: '#38ef7d',
    secondary: '#11998e',
    primaryHex: 0x38ef7d,
    secondaryHex: 0x11998e,
    aura1: 'rgba(56, 239, 125, 0.22)',
    aura2: 'rgba(17, 153, 142, 0.16)',
  },
  stealth: {
    id: 'stealth',
    name: 'Stealth Titanium',
    primary: '#e2e8f0',
    secondary: '#64748b',
    primaryHex: 0xe2e8f0,
    secondaryHex: 0x64748b,
    aura1: 'rgba(226, 232, 240, 0.18)',
    aura2: 'rgba(100, 116, 139, 0.14)',
  },
};

const Experience3DContext = createContext(null);

export function Experience3DProvider({ children }) {
  const [theme, setThemeState] = useState('blaze');
  const [bgMode, setBgModeState] = useState('wave'); // 'wave' | 'warp' | 'vortex'
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [parallaxSensitivity, setParallaxSensitivity] = useState(1.5);
  const [isPacerOpen, setIsPacerOpen] = useState(false);

  const setTheme = (t) => {
    setThemeState(t);
    if (soundEnabled) playSwitchSound();
    // Update CSS custom variables dynamically
    const conf = THEME_CONFIGS[t];
    if (conf) {
      document.documentElement.style.setProperty('--or', conf.primary);
      document.documentElement.style.setProperty('--cy', conf.secondary);
    }
  };

  const setBgMode = (mode) => {
    setBgModeState(mode);
    if (soundEnabled) playSwitchSound();
  };

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    if (val) playClickSound();
  };

  const triggerClickAudio = () => {
    if (soundEnabled) playClickSound();
  };

  const triggerHoverAudio = () => {
    if (soundEnabled) playHoverSound();
  };

  const triggerRepSuccessAudio = () => {
    if (soundEnabled) playRepSuccessSound();
  };

  return (
    <Experience3DContext.Provider
      value={{
        theme,
        themeConfig: THEME_CONFIGS[theme] || THEME_CONFIGS.blaze,
        setTheme,
        bgMode,
        setBgMode,
        soundEnabled,
        setSoundEnabled,
        parallaxSensitivity,
        setParallaxSensitivity,
        isPacerOpen,
        setIsPacerOpen,
        triggerClickAudio,
        triggerHoverAudio,
        triggerRepSuccessAudio,
      }}
    >
      {children}
    </Experience3DContext.Provider>
  );
}

export const useExperience3D = () => {
  const ctx = useContext(Experience3DContext);
  if (!ctx) {
    throw new Error('useExperience3D must be used within an Experience3DProvider');
  }
  return ctx;
};
