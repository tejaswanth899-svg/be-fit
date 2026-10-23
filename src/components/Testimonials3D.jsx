import TiltCard3D from './TiltCard3D';

const TESTIMONIALS_DATA = [
  {
    name: 'Marcus Vance',
    role: 'Competitive Powerlifter',
    metric: '+45 kg Deadlift PR',
    metricColor: '#ff6a2b',
    quote: 'The 3D kinetic apparatus visualizer helped me fix my hip hinge angle. Being able to inspect form from any angle in 360° is a game changer.',
    stars: 5,
    avatar: '🏋️‍♂️',
  },
  {
    name: 'Elena Rostova',
    role: 'Marathoner & Triathlete',
    metric: '-8.5 kg & 14% BF',
    metricColor: '#5ee7ff',
    quote: 'The goal transformation simulator and nutrition matrix took the guesswork out of meal timing. My energy levels are through the roof.',
    stars: 5,
    avatar: '🏃‍♀️',
  },
  {
    name: 'Devon Chen',
    role: 'Software Architect & Calisthenics Enthusiast',
    metric: '+7 kg Lean Muscle',
    metricColor: '#38ef7d',
    quote: 'The 3D anatomical mannequin makes targeting specific muscle heads effortless. I can see exactly which synergists fire during every compound lift.',
    stars: 5,
    avatar: '🧗‍♂️',
  },
];

export default function Testimonials3D() {
  return (
    <section className="section testimonials-3d-section">
      <div className="section-head text-center" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className="pill-badge-row" style={{ justifyContent: 'center' }}>
          <span className="pill neon-pulse">⭐ Athlete Testimonials</span>
          <span className="pill-ghost">Real Verified Transformations</span>
        </div>
        <h2>Real Results in Real Dimensions</h2>
        <p className="lead" style={{ margin: '8px auto 0' }}>
          Discover how everyday lifters and elite athletes break through plateaus using BE-FIT.
        </p>
      </div>

      <div className="grid g3">
        {TESTIMONIALS_DATA.map((t) => (
          <TiltCard3D key={t.name} className="card testimonial-3d-card glass" maxTilt={14}>
            <div className="t-card-head">
              <div className="t-avatar-box">{t.avatar}</div>
              <div className="t-author-col">
                <strong className="t-name">{t.name}</strong>
                <span className="t-role">{t.role}</span>
              </div>
              <span className="t-metric-tag" style={{ color: t.metricColor, borderColor: t.metricColor }}>
                {t.metric}
              </span>
            </div>

            <div className="t-stars-row">
              {'★'.repeat(t.stars)}
            </div>

            <p className="t-quote">
              "{t.quote}"
            </p>

            <div className="t-card-footer">
              <span className="t-verified-pill">✓ Verified BE-FIT Athlete</span>
            </div>
          </TiltCard3D>
        ))}
      </div>
    </section>
  );
}
