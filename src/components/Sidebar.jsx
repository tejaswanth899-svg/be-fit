import { Link } from 'react-router-dom';
import AnimatedMenu from './AnimatedMenu';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`backdrop${open ? ' show' : ''}`} onClick={onClose} />
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <Link to="/" className="logo" onClick={onClose}>
          BE<span>FIT</span> <small className="badge-3d-nav">3D</small>
        </Link>

        <AnimatedMenu onClose={onClose} />

        <div className="side-note">
          <strong>Build Your Body.</strong>
          <span>Experience in 3D.</span>
        </div>
      </aside>
    </>
  );
}
