import PageHeader from '../components/PageHeader';
import DietCard from '../components/DietCard';
import Button from '../components/Button';
import { DIET, PROTEIN } from '../data/data';

export default function Diet() {
  return (
    <>
      <PageHeader title="Diet and protein" sub="Food is half of your results. Keep it simple, eat real food and be consistent." />
      <section className="split">
        <div className="card">
          <h2>Why protein matters</h2>
          <p>Protein repairs and builds muscle after training and keeps you full. Most active people do well with 1.6 to 2.2 g per kg of body weight each day, spread across 3 to 5 meals.</p>
          <div className="callout">Example: a 70 kg person aims for about 112 to 154 g of protein daily.</div>
        </div>
        <div className="card">
          <h3>Protein in common foods</h3>
          <table className="table"><tbody>
            {PROTEIN.map((p) => <tr key={p.f}><td>{p.f}</td><td><b>{p.p} g</b></td></tr>)}
          </tbody></table>
        </div>
      </section>
      <div className="grid g3 section">{DIET.map((d) => <DietCard key={d.title} d={d} />)}</div>
      <div className="row"><Button to="/bmi">Calculate your BMI</Button><Button to="/goals" variant="ghost">Match food to your goal</Button></div>
    </>
  );
}
