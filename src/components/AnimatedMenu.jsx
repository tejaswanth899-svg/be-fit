import { NavLink } from 'react-router-dom';
import { NAV } from '../data/data';

export default function AnimatedMenu({ onClose }) {
  return (
    <nav className="menu" aria-label="Main menu">
      {NAV.map((l, i) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          onClick={onClose}
          style={{ '--i': i }}
          className={({ isActive }) => 'menu-link' + (isActive ? ' active' : '')}
        >
          <span className="menu-icon">{l.icon}</span>
          <span>{l.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
