import { Link } from 'react-router-dom';
import TiltCard3D from './TiltCard3D';

export default function FitnessCard({ icon, title, text, tag, to }) {
  const body = (
    <div className="card hover card-3d-inner">
      <div className="icon-box icon-box-3d">{icon}</div>
      {tag && <span className="tag">{tag}</span>}
      <h3>{title}</h3>
      <p>{text}</p>
      {to && <span className="more">Explore →</span>}
    </div>
  );
  return (
    <TiltCard3D>
      {to ? <Link to={to} className="card-link-block">{body}</Link> : body}
    </TiltCard3D>
  );
}
