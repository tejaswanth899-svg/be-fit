import PageHeader from '../components/PageHeader';
import ProgressCard from '../components/ProgressCard';
import FitnessCard from '../components/FitnessCard';
import Results3DVisualizer from '../components/Results3DVisualizer';
import TiltCard3D from '../components/TiltCard3D';
import Button from '../components/Button';
import { STATS, WEEK, ACHIEVEMENTS } from '../data/data';

export default function Results() {
  return (
    <>
      <PageHeader
        title="Results & 3D Telemetry Dashboard"
        sub="Kinetic workout data, weekly volume monoliths, and unlocked fitness milestones."
      />

      <div className="grid g4">
        {STATS.map((s) => (
          <ProgressCard key={s.label} {...s} />
        ))}
      </div>

      {/* 3D Weekly Monoliths Visualization */}
      <section className="section">
        <TiltCard3D>
          <div className="card card-3d-inner" style={{ padding: '24px 20px' }}>
            <Results3DVisualizer weekData={WEEK} />
          </div>
        </TiltCard3D>
      </section>

      {/* Traditional 2D Breakdown */}
      <section className="section">
        <TiltCard3D>
          <div className="card card-3d-inner">
            <div className="card-top">
              <h3>Weekly Intensity Comparison</h3>
              <span className="tag">Aggregated</span>
            </div>
            <div className="bars">
              {WEEK.map((d) => (
                <div key={d.d} className="col">
                  <i style={{ height: `${d.v}%` }} />
                  <span>{d.d}</span>
                </div>
              ))}
            </div>
          </div>
        </TiltCard3D>
      </section>

      {/* Achievements with 3D Tilt */}
      <section className="section">
        <div className="section-head">
          <span className="pill">Gamified Progress</span>
          <h2>Milestones & Trophies</h2>
        </div>
        <div className="grid g3">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.title} className={a.done ? '' : 'locked'}>
              <FitnessCard
                icon={a.icon}
                title={a.title}
                text={a.text}
                tag={a.done ? 'Unlocked' : 'In progress'}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="row">
        <Button to="/studio">Test in 3D Studio</Button>
        <Button to="/workout" variant="ghost">Log your next workout</Button>
        <Button to="/goals" variant="ghost">Set Goals</Button>
      </div>
    </>
  );
}
