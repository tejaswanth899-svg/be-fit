import PageHeader from '../components/PageHeader';
import FitnessCard from '../components/FitnessCard';
import Button from '../components/Button';
import { JOURNEY, LEVELS, CONSISTENCY } from '../data/data';

export default function Journey() {
  return (
    <>
      <PageHeader title="Your fitness journey" sub="Five steps and three levels. Follow them in order and you will always know what to do next." />
      <section className="section">
        <h2>The five steps</h2>
        <ol className="steps">
          {JOURNEY.map((s, i) => (
            <li key={s.title} className="card"><span className="num">{i + 1}</span><div><h3>{s.title}</h3><p>{s.text}</p></div></li>
          ))}
        </ol>
      </section>
      <section className="section">
        <h2>Beginner to advanced</h2>
        <div className="grid g3">{LEVELS.map((l) => <FitnessCard key={l.tag} {...l} />)}</div>
      </section>
      <section className="section card">
        <h2>Stay consistent</h2>
        <ul className="ticks wide">{CONSISTENCY.map((c) => <li key={c}>{c}</li>)}</ul>
        <div className="row"><Button to="/workout">Pick a workout</Button><Button to="/goals" variant="ghost">Set your goal</Button></div>
      </section>
    </>
  );
}
