import PageHeader from '../components/PageHeader';
import WorkoutCard from '../components/WorkoutCard';
import Button from '../components/Button';
import { WORKOUTS } from '../data/data';

export default function Workout() {
  return (
    <>
      <PageHeader
        title="Workout Categories"
        sub="Choose a training style to inspect exercises, target muscle recruitment, and set structures."
      />

      <div className="workout-banner glass" style={{ marginBottom: '28px', padding: '20px 24px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span className="pill">3D Mode Available</span>
          <h3 style={{ margin: '6px 0 2px' }}>Interactive Apparatus & Anatomy</h3>
          <p style={{ margin: 0 }}>Simulate dumbbell loads or inspect biomechanics before starting.</p>
        </div>
        <Button to="/studio">Open 3D Studio →</Button>
      </div>

      <div className="grid g3">
        {WORKOUTS.map((w) => (
          <WorkoutCard key={w.cat} w={w} />
        ))}
      </div>
    </>
  );
}
