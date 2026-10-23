import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ExerciseCard from '../components/ExerciseCard';
import MuscleExplorer3D from '../components/MuscleExplorer3D';
import Button from '../components/Button';
import { EXERCISES, WORKOUTS } from '../data/data';

export default function Exercises() {
  const [params, setParams] = useSearchParams();
  const [show3DAnatomy, setShow3DAnatomy] = useState(false);
  const cat = params.get('cat') || 'All';
  const list = cat === 'All' ? EXERCISES : EXERCISES.filter((e) => e.c === cat);
  const cats = ['All', ...WORKOUTS.map((w) => w.cat)];

  const handleSelectMuscle = (muscleKey) => {
    const mapping = {
      chest: 'Upper Body',
      back: 'Upper Body',
      shoulders: 'Upper Body',
      arms: 'Upper Body',
      core: 'Core',
      legs: 'Lower Body',
    };
    const targetCat = mapping[muscleKey] || 'All';
    setParams(targetCat === 'All' ? {} : { cat: targetCat });
  };

  return (
    <>
      <PageHeader
        title="Exercise Library & Biomechanics"
        sub="Target muscle mapping, proper form cues, and recommended rep ranges."
      />

      <div className="library-toolbar">
        <button
          type="button"
          className={`btn ${show3DAnatomy ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShow3DAnatomy((v) => !v)}
        >
          {show3DAnatomy ? '👁 Hide 3D Anatomy Scanner' : '🧍 Open 3D Anatomy Scanner'}
        </button>

        <Button to="/studio" variant="ghost">Launch 3D Studio →</Button>
      </div>

      {show3DAnatomy && (
        <section className="section" style={{ marginTop: '20px' }}>
          <MuscleExplorer3D onSelectMuscle={handleSelectMuscle} />
        </section>
      )}

      <div className="chips" style={{ marginTop: '24px' }}>
        {cats.map((c) => (
          <button
            key={c}
            className={`chip${c === cat ? ' on' : ''}`}
            onClick={() => (c === 'All' ? setParams({}) : setParams({ cat: c }))}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid g3">
        {list.map((e) => (
          <ExerciseCard key={e.n} e={e} />
        ))}
      </div>
    </>
  );
}
