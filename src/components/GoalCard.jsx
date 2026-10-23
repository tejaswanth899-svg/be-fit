import Button from './Button';
import TiltCard3D from './TiltCard3D';

export default function GoalCard({ g }) {
  return (
    <TiltCard3D>
      <div className="card hover card-3d-inner">
        <div className="icon-box icon-box-3d">{g.icon}</div>
        <h3>{g.title}</h3>
        <p>{g.text}</p>
        <ul className="ticks">
          {g.focus.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <Button to={`/exercises?cat=${encodeURIComponent(g.cat)}`} variant="ghost">
          Train for this
        </Button>
      </div>
    </TiltCard3D>
  );
}
