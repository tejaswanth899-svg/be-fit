import Button from './Button';
import Hero3DViewer from './Hero3DViewer';

export default function HeroSection() {
  return (
    <section className="hero hero-3d-layout">
      <div className="hero-copy">
        <div className="pill-badge-row">
          <span className="pill neon-pulse">⚡ 3D Interactive Fitness Arena</span>
          <span className="pill-ghost">Web3D Enabled</span>
        </div>
        <h1>
          Sculpt your body.<br />
          <span className="gradient-text-3d">Experience in 3D.</span>
        </h1>
        <p className="lead">
          Interactive 3D equipment inspection, anatomical muscle mapping, custom workouts, nutrition,
          and biometric tracking in one state-of-the-art dashboard.
        </p>
        <div className="row">
          <Button to="/studio">Enter 3D Studio</Button>
          <Button to="/journey" variant="ghost">Start Your Journey</Button>
          <Button to="/exercises" variant="ghost">Browse Exercises</Button>
        </div>

        <div className="hero-stat-pills">
          <div className="h-stat-pill">
            <b>4+</b> <span>3D Models</span>
          </div>
          <div className="h-stat-pill">
            <b>360°</b> <span>Orbit Control</span>
          </div>
          <div className="h-stat-pill">
            <b>60 FPS</b> <span>WebGL Engine</span>
          </div>
        </div>
      </div>

      <div className="hero-art-3d">
        <Hero3DViewer />
      </div>
    </section>
  );
}
