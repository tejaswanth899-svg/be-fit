import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Hero3DViewer from '../components/Hero3DViewer';
import MuscleExplorer3D from '../components/MuscleExplorer3D';
import TiltCard3D from '../components/TiltCard3D';
import Button from '../components/Button';

export default function Studio3D() {
  const [activeTab, setActiveTab] = useState('apparatus');
  const [simWeight, setSimWeight] = useState(24);
  const [isSimulating, setIsSimulating] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const startSimulation = () => {
    setIsSimulating(true);
    setRepCount(0);
  };

  const logRep = () => {
    setRepCount((r) => r + 1);
  };

  return (
    <div className="studio-3d-page">
      <PageHeader
        title="3D Fitness Holographic Studio"
        sub="Immersive 3D visualization arena. Inspect biomechanics, analyze muscular targets, and simulate training load in real-time."
      />

      <div className="studio-tabs-nav">
        <button
          type="button"
          className={`studio-nav-btn ${activeTab === 'apparatus' ? 'active' : ''}`}
          onClick={() => setActiveTab('apparatus')}
        >
          🏋️ 3D Equipment Inspector
        </button>
        <button
          type="button"
          className={`studio-nav-btn ${activeTab === 'anatomy' ? 'active' : ''}`}
          onClick={() => setActiveTab('anatomy')}
        >
          🧍 3D Anatomical Scanner
        </button>
        <button
          type="button"
          className={`studio-nav-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          ⚡ 3D Workout Simulation
        </button>
      </div>

      {activeTab === 'apparatus' && (
        <section className="studio-section">
          <div className="studio-hero-grid">
            <Hero3DViewer />

            <div className="studio-controls-sidebar">
              <TiltCard3D className="card">
                <h3>Apparatus Calibration</h3>
                <p>Dynamically calibrate your resistance setup and verify center-of-mass balance.</p>

                <div className="control-slider-block">
                  <div className="slider-label">
                    <span>Virtual Plate Resistance:</span>
                    <b>{simWeight} kg</b>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="2.5"
                    value={simWeight}
                    onChange={(e) => setSimWeight(parseFloat(e.target.value))}
                  />
                  <div className="scale">
                    <span>5 kg</span>
                    <span>30 kg</span>
                    <span>60 kg</span>
                  </div>
                </div>

                <div className="specs-list">
                  <div className="spec-row">
                    <span>Bar Diameter:</span> <b>28 mm Olympic Spec</b>
                  </div>
                  <div className="spec-row">
                    <span>Inertial Balance:</span> <b>99.4% Symmetrical</b>
                  </div>
                  <div className="spec-row">
                    <span>Grip Knurl:</span> <b>Aggressive Diamond PBR</b>
                  </div>
                </div>

                <div className="studio-card-actions">
                  <Button to="/exercises">Find Exercises for this Weight →</Button>
                </div>
              </TiltCard3D>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'anatomy' && (
        <section className="studio-section">
          <MuscleExplorer3D />
        </section>
      )}

      {activeTab === 'simulator' && (
        <section className="studio-section">
          <div className="simulator-grid">
            <div className="card glass simulator-card">
              <div className="sim-header">
                <span className="pill">Live Kinetic Tracker</span>
                <h3>Dumbbell Press Simulation</h3>
              </div>

              <div className="sim-stats-row">
                <div className="sim-stat-box">
                  <span className="label">ACTIVE LOAD</span>
                  <strong className="value">{simWeight} kg</strong>
                </div>
                <div className="sim-stat-box">
                  <span className="label">COMPLETED REPS</span>
                  <strong className="value pulse-val">{repCount}</strong>
                </div>
                <div className="sim-stat-box">
                  <span className="label">EST. POWER</span>
                  <strong className="value">{repCount * 28} W</strong>
                </div>
              </div>

              <div className="sim-action-area">
                {!isSimulating ? (
                  <button type="button" className="btn btn-primary" onClick={startSimulation}>
                    🚀 Initialize Session
                  </button>
                ) : (
                  <div className="sim-active-controls">
                    <button type="button" className="btn btn-primary rep-btn" onClick={logRep}>
                      💥 Complete Rep (+1)
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setIsSimulating(false)}
                    >
                      ⏹ Finish Set
                    </button>
                  </div>
                )}
              </div>
            </div>

            <TiltCard3D className="card">
              <h3>Real-Time Biomechanical Coaching</h3>
              <ul className="ticks">
                <li>Drive upward through the center of your palms.</li>
                <li>Inhale on the controlled 3-second descent; explode upward on the exhale.</li>
                <li>Maintain 3 points of contact on your bench: head, upper back, and glutes.</li>
                <li>Avoid locking elbows aggressively at peak extension to protect joint cartilage.</li>
              </ul>
              <div className="row">
                <Button to="/workout" variant="ghost">Browse All Routines</Button>
              </div>
            </TiltCard3D>
          </div>
        </section>
      )}
    </div>
  );
}
