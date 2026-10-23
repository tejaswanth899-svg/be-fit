import PageHeader from '../components/PageHeader';
import GoalCard from '../components/GoalCard';
import { GOALS } from '../data/data';

export default function Goals() {
  return (
    <>
      <PageHeader title="Choose your goal" sub="Different goals need different training and food. Pick the one that matters most right now." />
      <div className="grid g3">{GOALS.map((g) => <GoalCard key={g.title} g={g} />)}</div>
    </>
  );
}
