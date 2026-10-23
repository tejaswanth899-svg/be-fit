import { Link } from 'react-router-dom';
import TiltCard3D from './TiltCard3D';

export default function WorkoutCard({ w }) {
  return (
    <TiltCard3D>
      <Link to={`/exercises?cat=${encodeURIComponent(w.cat)}`} className="card hover card-link-block card-3d-inner">
        <div className="icon-box icon-box-3d">{w.icon}</div>
        <h3>{w.cat}</h3>
        <p>{w.text}</p>
        <div className="meta">
          <span>⏱ {w.time}</span>
          <span>🔁 {w.freq}</span>
        </div>
        <span className="more">See exercises →</span>
      </Link>
    </TiltCard3D>
  );
}
