import { Link } from 'react-router-dom';
import Button from './Button';

export default function Navbar({ open, onToggle }) {
  return (
    <header className="navbar">
      <button
        className={`burger${open ? ' open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <Link to="/" className="logo logo-sm">
        BE<span>FIT</span> <small className="badge-3d-nav">3D</small>
      </Link>

      <div className="nav-actions">
        <Button to="/studio" variant="ghost" className="nav-3d-btn">
          🌐 3D Studio
        </Button>
        <Button to="/bmi" variant="ghost">
          Check BMI
        </Button>
        <Button to="/workout">
          Explore Workouts
        </Button>
      </div>
    </header>
  );
}
