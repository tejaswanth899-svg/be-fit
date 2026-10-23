import TiltCard3D from './TiltCard3D';

const METRICS_3D = [
  {
    icon: '🏋️',
    value: '148,200+',
    label: 'Workouts Completed',
    sub: 'Verified Web3D sessions',
    trend: '+18.4% this month',
    trendColor: '#38ef7d',
  },
  {
    icon: '🎯',
    value: '99.4%',
    label: 'Form Precision Rate',
    sub: 'Biomechanical accuracy',
    trend: 'Sensor-calibrated',
    trendColor: '#5ee7ff',
  },
  {
    icon: '🔥',
    value: '4,280,000+',
    label: 'Calories Scorched',
    sub: 'Active energetic burn',
    trend: '+450k this week',
    trendColor: '#ff6a2b',
  },
  {
    icon: '⚡',
    value: '60 FPS',
    label: 'WebGL Rendering Engine',
    sub: 'Zero-latency GPU pipeline',
    trend: 'Three.js Powered',
    trendColor: '#ffd45e',
  },
];

export default function CommunityStats3D() {
  return (
    <section className="section community-3d-stats">
      <div className="section-head text-center" style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="pill-badge-row" style={{ justifyContent: 'center' }}>
          <span className="pill neon-pulse">🌐 Global Community Telemetry</span>
          <span className="pill-ghost">Live Cloud Synchronized</span>
        </div>
        <h2>Powered by High-Performance Real-Time 3D Analytics</h2>
        <p className="lead" style={{ margin: '8px auto 0' }}>
          Over 24,000 athletes rely on BE-FIT's interactive 3D platform for kinetic form precision and progression.
        </p>
      </div>

      <div className="grid g4">
        {METRICS_3D.map((m) => (
          <TiltCard3D key={m.label} className="card community-stat-card glass" maxTilt={12}>
            <div className="c-stat-top">
              <span className="c-stat-icon">{m.icon}</span>
              <span className="c-stat-trend" style={{ color: m.trendColor }}>
                {m.trend}
              </span>
            </div>
            <div className="c-stat-body">
              <strong className="c-stat-value gradient-text-3d">{m.value}</strong>
              <h4 className="c-stat-title">{m.label}</h4>
              <p className="c-stat-sub">{m.sub}</p>
            </div>
          </TiltCard3D>
        ))}
      </div>
    </section>
  );
}
