import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BiometricVault3D from '../components/BiometricVault3D';
import TiltCard3D from '../components/TiltCard3D';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useExperience3D } from '../context/Experience3DContext';
import { playClickSound, playSwitchSound, playVaultUnlockSound, playAlertSound } from '../utils/audio';

const empty = { name: '', email: '', password: '', confirm: '' };

export default function Login() {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState(empty);
  const [err, setErr] = useState({});
  const [ok, setOk] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'authenticating' | 'success' | 'error'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { soundEnabled } = useExperience3D();
  const reg = mode === 'register';

  const setField = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    if (err[k]) {
      setErr((prev) => ({ ...prev, [k]: null }));
    }
  };

  const switchMode = (m) => {
    if (soundEnabled) playSwitchSound();
    setMode(m);
    setErr({});
    setOk('');
    setF(empty);
    setAuthStatus('idle');
  };

  const fillDemoCredentials = () => {
    if (soundEnabled) playClickSound();
    setF({
      name: 'Alex Vance',
      email: 'demo@befit.io',
      password: 'password123',
      confirm: 'password123',
    });
    setErr({});
    setOk('');
    setAuthStatus('idle');
  };

  const submit = (e) => {
    e.preventDefault();
    if (soundEnabled) playClickSound();

    const er = {};
    if (reg && f.name.trim().length < 2) er.name = 'Please enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Please enter a valid email address.';
    if (f.password.length < 6) er.password = 'Password must be at least 6 characters.';
    if (reg && f.confirm !== f.password) er.confirm = 'Passwords do not match.';

    if (Object.keys(er).length > 0) {
      setErr(er);
      setAuthStatus('error');
      if (soundEnabled) playAlertSound();
      return;
    }

    // Begin 3D Authentication Sequence
    setErr({});
    setAuthStatus('authenticating');

    setTimeout(() => {
      setAuthStatus('success');
      if (soundEnabled) playVaultUnlockSound();
      setOk(
        reg
          ? '🎉 Account provisioned successfully! Unlocking 3D Dashboard...'
          : '🔓 Biometric credentials validated. Unlocking 3D Dashboard...'
      );

      // Smooth transition into dashboard after celebration
      setTimeout(() => {
        login({
          name: f.name || (f.email.split('@')[0] ? f.email.split('@')[0].toUpperCase() : 'Athlete'),
          email: f.email,
        });
        navigate('/');
      }, 700);
    }, 750);
  };

  return (
    <div className="login-page-3d">
      {/* Header Bar */}
      <div className="login-header-section text-center" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="pill-badge-row" style={{ justifyContent: 'center' }}>
          <span className="pill neon-pulse">🔐 Biometric Neural Security</span>
          <span className="pill-ghost">Web3D Passkey Enabled</span>
        </div>
        <h2>{reg ? 'Create Athlete Account' : 'Authenticate Athlete Session'}</h2>
        <p className="lead" style={{ margin: '8px auto 0', maxWidth: '58ch' }}>
          Access your personalized 3D exercise studio, biomechanical logs, and nutrition plans with 256-bit encrypted authentication.
        </p>
      </div>

      {/* Main Split Layout: 3D Biometric Vault + Authentication Card */}
      <div className="login-grid-layout">
        {/* Left Column: Interactive 3D Biometric Cyber Vault */}
        <div className="login-3d-visual-panel glass">
          <div className="vault-panel-head">
            <span className="pill-ghost">Hardware-Level Telemetry</span>
            <span className="v-status-indicator">
              <span className={`hud-dot ${authStatus === 'error' ? 'red' : authStatus === 'success' ? 'green' : ''}`} />
              {authStatus === 'authenticating'
                ? 'COMPUTING CIPHER...'
                : authStatus === 'success'
                ? 'ACCESS GRANTED'
                : authStatus === 'error'
                ? 'ALERT: MISMATCH'
                : 'STANDBY'}
            </span>
          </div>

          <BiometricVault3D
            mode={mode}
            activeField={activeField}
            status={authStatus}
          />

          <div className="vault-features-list">
            <div className="vf-item">
              <span>🛡️ Zero-Knowledge Biometric Encryption</span>
            </div>
            <div className="vf-item">
              <span>⚡ WebGL 3D Real-Time Cryptographic Feedback</span>
            </div>
            <div className="vf-item">
              <span>🔒 Client-Side State Protection</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Tilt Authentication Form */}
        <div className="login-form-panel">
          <TiltCard3D className="card auth-card-3d glass" maxTilt={10}>
            {/* Mode Switch Tabs */}
            <div className="auth-tabs-row">
              <button
                type="button"
                className={`auth-tab-btn ${!reg ? 'active' : ''}`}
                onClick={() => switchMode('login')}
              >
                🔐 Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${reg ? 'active' : ''}`}
                onClick={() => switchMode('register')}
              >
                ⚡ Register
              </button>
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="demo-fill-banner">
              <div>
                <span className="df-label">TESTING PREVIEW</span>
                <span className="df-desc">Instant 1-Click Demo Credentials</span>
              </div>
              <button
                type="button"
                className="btn-demo-fill"
                onClick={fillDemoCredentials}
              >
                ⚡ Auto-Fill
              </button>
            </div>

            {/* Authentication Form */}
            <form className="form auth-form" onSubmit={submit} noValidate>
              {reg && (
                <label>
                  Full Name
                  <input
                    type="text"
                    value={f.name}
                    onChange={setField('name')}
                    onFocus={() => setActiveField('name')}
                    onBlur={() => setActiveField(null)}
                    placeholder="e.g. Alex Vance"
                    className={err.name ? 'bad' : ''}
                  />
                  {err.name && <em className="auth-err-msg">{err.name}</em>}
                </label>
              )}

              <label>
                Email Address
                <input
                  type="email"
                  value={f.email}
                  onChange={setField('email')}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  placeholder="athlete@befit.io"
                  className={err.email ? 'bad' : ''}
                />
                {err.email && <em className="auth-err-msg">{err.email}</em>}
              </label>

              <label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Password</span>
                  <button
                    type="button"
                    className="pwd-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️ Hide' : '👁️‍🗨️ Show'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={f.password}
                  onChange={setField('password')}
                  onFocus={() => setActiveField('password')}
                  onBlur={() => setActiveField(null)}
                  placeholder="••••••••••••"
                  className={err.password ? 'bad' : ''}
                />
                {err.password && <em className="auth-err-msg">{err.password}</em>}
              </label>

              {reg && (
                <label>
                  Confirm Password
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={f.confirm}
                    onChange={setField('confirm')}
                    onFocus={() => setActiveField('confirm')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Repeat password"
                    className={err.confirm ? 'bad' : ''}
                  />
                  {err.confirm && <em className="auth-err-msg">{err.confirm}</em>}
                </label>
              )}

              {/* Remember Me Checkbox */}
              <div className="auth-options-row">
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: 'auto', accentColor: 'var(--or)', margin: 0 }}
                  />
                  <span style={{ fontSize: '0.84rem', color: 'var(--mut)' }}>Stay authenticated on this device</span>
                </label>
              </div>

              {/* Feedback Alert */}
              {ok && (
                <div className="ok auth-ok-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{ok}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" full>
                {authStatus === 'authenticating'
                  ? 'Decrypting Biometric Key...'
                  : reg
                  ? 'Create Athlete Profile →'
                  : 'Unlock 3D Dashboard →'}
              </Button>
            </form>

            <div className="auth-footer-swap">
              <span>{reg ? 'Already an athlete member?' : 'New to BE-FIT?'}</span>{' '}
              <button
                type="button"
                className="link swap-link"
                onClick={() => switchMode(reg ? 'login' : 'register')}
              >
                {reg ? 'Sign In to Session' : 'Create Free Account'}
              </button>
            </div>
          </TiltCard3D>
        </div>
      </div>
    </div>
  );
}
