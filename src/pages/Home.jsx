import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CommunityStats3D from '../components/CommunityStats3D';
import KineticVisualizer3D from '../components/KineticVisualizer3D';
import MuscleExplorer3D from '../components/MuscleExplorer3D';
import GoalSimulator3D from '../components/GoalSimulator3D';
import Testimonials3D from '../components/Testimonials3D';
import PortalCTA3D from '../components/PortalCTA3D';
import TiltCard3D from '../components/TiltCard3D';
import Button from '../components/Button';
import { useExperience3D } from '../context/Experience3DContext';

const ECOSYSTEM_FEATURES_3D = [
  {
    icon: '🏋️',
    tag: 'Interactive WebGL',
    title: '3D Equipment Calibration',
    text: 'Inspect Olympic dumbbells, barbells, and kettlebells in 360°. Calibrate center of mass and virtual plate loads.',
    to: '/studio',
    badge: '360° Inspection',
  },
  {
    icon: '🧬',
    tag: 'Anatomical AI',
    title: '3D Muscle Mapping',
    text: 'Highlight target muscle groups and synergists on an interactive 3D mannequin with form cues and rep ranges.',
    to: '/studio',
    badge: 'Real-time Glow',
  },
  {
    icon: '⏱️',
    tag: 'Cadence Engine',
    title: '3D Rep Pacer Metronome',
    text: 'Maintain strict eccentric and concentric time-under-tension using WebGL visual pacers and procedural audio tones.',
    to: '/workout',
    badge: 'Audio Synced',
  },
  {
    icon: '🥗',
    tag: 'Nutrition Architect',
    title: 'Precision Macro & Fuel Engine',
    text: 'Dial in protein requirements, pre/post workout nutrition, and hydration tailored to your training intensity.',
    to: '/diet',
    badge: 'Dynamic Targets',
  },
  {
    icon: '⚖️',
    tag: 'Biometric Stage',
    title: '3D Body Mass & Gauge Visualizer',
    text: 'Instantaneous BMI classification, body composition gauges, and health bracket visualization in 3D.',
    to: '/bmi',
    badge: 'Instant Results',
  },
  {
    icon: '📈',
    tag: 'Progression Telemetry',
    title: 'Volume & Streak Dashboard',
    text: 'Quantify weekly training volume, personal records, and recovery metrics with high-visibility kinetic charts.',
    to: '/results',
    badge: 'Streak Tracking',
  },
];

export default function Home() {
  const { triggerClickAudio } = useExperience3D();

  return (
    <div className="landing-page-3d">
      {/* 1. HERO SECTION WITH 3D ORBIT VIEWER */}
      <HeroSection />

      {/* 2. REAL-TIME 3D TELEMETRY & COMMUNITY PULSE */}
      <CommunityStats3D />

      {/* 3. INTERACTIVE 3D KINETIC WORKOUT & REP VISUALIZER */}
      <section className="section kinetic-visualizer-section">
        <KineticVisualizer3D />
      </section>

      {/* 4. INTERACTIVE 3D ANATOMICAL MUSCLE STATION */}
      <section className="section section-3d-feature">
        <div className="section-head text-center" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="pill-badge-row" style={{ justifyContent: 'center' }}>
            <span className="pill neon-pulse">🧬 Interactive Anatomical Lab</span>
            <span className="pill-ghost">Dynamic Viewports</span>
          </div>
          <h2>Biomechanical Anatomy Explorer</h2>
          <p className="lead" style={{ margin: '8px auto 0' }}>
            Click muscle heads to zoom the 3D camera, illuminate target zones with neon emissive glow, and view cue coaching.
          </p>
        </div>
        <MuscleExplorer3D />
      </section>

      {/* 5. INTERACTIVE 3D GOAL TRANSFORMATION MATRIX */}
      <section className="section goal-simulator-section">
        <GoalSimulator3D />
      </section>

      {/* 6. COMPREHENSIVE 3D ECOSYSTEM SUITE */}
      <section className="section">
        <div className="section-head text-center" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="pill-badge-row" style={{ justifyContent: 'center' }}>
            <span className="pill neon-pulse">⚡ Complete Platform</span>
            <span className="pill-ghost">Gyroscopic 3D Cards</span>
          </div>
          <h2>Engineered for Uncompromising Performance</h2>
          <p className="lead" style={{ margin: '8px auto 0' }}>
            Every tool is designed to work cohesively to eliminate guesswork and accelerate results.
          </p>
        </div>

        <div className="grid g3">
          {ECOSYSTEM_FEATURES_3D.map((f) => (
            <TiltCard3D key={f.title} className="card feature-card-3d glass hover" maxTilt={15}>
              <Link to={f.to} onClick={triggerClickAudio} className="card-link-block">
                <div className="card-top">
                  <div className="icon-box icon-box-3d">{f.icon}</div>
                  <span className="tag">{f.badge}</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <span className="pill-ghost" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                    {f.tag}
                  </span>
                  <h3 style={{ marginTop: '8px', fontSize: '1.4rem' }}>{f.title}</h3>
                  <p style={{ marginTop: '8px', fontSize: '0.92rem', lineHeight: '1.55' }}>
                    {f.text}
                  </p>
                </div>
                <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="more">Explore Module →</span>
                </div>
              </Link>
            </TiltCard3D>
          ))}
        </div>
      </section>

      {/* 7. ATHLETE TESTIMONIALS WITH 3D DEPTH */}
      <Testimonials3D />

      {/* 8. SPECTACULAR 3D PORTAL CALL TO ACTION */}
      <PortalCTA3D />
    </div>
  );
}
