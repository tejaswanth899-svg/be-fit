import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExperience3D, THEME_CONFIGS } from '../context/Experience3DContext';

export default function Floating3DControls() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    theme,
    setTheme,
    bgMode,
    setBgMode,
    soundEnabled,
    setSoundEnabled,
    parallaxSensitivity,
    setParallaxSensitivity,
    setIsPacerOpen,
    triggerClickAudio,
  } = useExperience3D();

  const toggleOpen = () => {
    triggerClickAudio();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="floating-3d-hub">
      {/* Control Drawer / Modal Popout */}
      {isOpen && (
        <div className="floating-hud-panel glass">
          <div className="hud-panel-head">
            <div className="hud-title-col">
              <span className="pill">3D System Controller</span>
              <h4>Experience Parameters</h4>
            </div>
            <button
              type="button"
              className="hud-close-x"
              onClick={toggleOpen}
              aria-label="Close 3D controls"
            >
              ✕
            </button>
          </div>

          {/* Theme Chooser */}
          <div className="hud-control-section">
            <label className="hud-sec-label">NEON LIGHTING THEME</label>
            <div className="hud-theme-grid">
              {Object.keys(THEME_CONFIGS).map((k) => {
                const conf = THEME_CONFIGS[k];
                const active = theme === k;
                return (
                  <button
                    key={k}
                    type="button"
                    className={`hud-theme-btn ${active ? 'active' : ''}`}
                    onClick={() => setTheme(k)}
                  >
                    <span
                      className="hud-theme-color-dot"
                      style={{ background: conf.primary }}
                    />
                    <span>{conf.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Background Dynamics */}
          <div className="hud-control-section">
            <label className="hud-sec-label">3D BACKGROUND DYNAMICS</label>
            <div className="hud-chip-row">
              {[
                { id: 'wave', label: '🌊 Cosmic Wave' },
                { id: 'warp', label: '🚀 Hyperspace Warp' },
                { id: 'vortex', label: '🌀 Gravity Vortex' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`hud-chip ${bgMode === m.id ? 'active' : ''}`}
                  onClick={() => setBgMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Parallax Sensitivity */}
          <div className="hud-control-section">
            <div className="hud-slider-head">
              <label className="hud-sec-label">CURSOR PARALLAX DEPTH</label>
              <b className="hud-slider-val">{parallaxSensitivity}x</b>
            </div>
            <div className="hud-chip-row">
              {[
                { val: 0.8, label: 'Subtle' },
                { val: 1.5, label: 'Balanced' },
                { val: 2.4, label: 'Extreme 3D' },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  className={`hud-chip ${parallaxSensitivity === s.val ? 'active' : ''}`}
                  onClick={() => setParallaxSensitivity(s.val)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Synthesizer Toggle */}
          <div className="hud-control-section">
            <div className="hud-toggle-row">
              <div>
                <label className="hud-sec-label">SYNTHESIZED SCI-FI AUDIO</label>
                <p className="hud-desc">Procedural Web Audio clicks and cadence tones</p>
              </div>
              <button
                type="button"
                className={`hud-toggle-pill ${soundEnabled ? 'on' : 'off'}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? '🔊 ON' : '🔇 MUTED'}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="hud-footer-actions">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '0.88rem', padding: '10px 16px' }}
              onClick={() => {
                setIsOpen(false);
                setIsPacerOpen(true);
              }}
            >
              ⏱️ Open 3D Rep Pacer Metronome
            </button>
            <Link
              to="/studio"
              className="btn btn-ghost"
              style={{ width: '100%', fontSize: '0.88rem', padding: '10px 16px', marginTop: '6px' }}
              onClick={() => setIsOpen(false)}
            >
              🏋️ Full 3D Studio Arena →
            </Link>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        className={`floating-hub-trigger glass ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}
        aria-label="Toggle 3D experience options"
      >
        <span className="hub-sparkle-dot" />
        <span className="hub-text">⚡ 3D HUD</span>
        <span className="hub-badge-pill">{theme.toUpperCase()}</span>
      </button>
    </div>
  );
}
