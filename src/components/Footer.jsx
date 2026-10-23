import { Link } from 'react-router-dom';
import { NAV } from '../data/data';

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <Link to="/" className="logo">BE<span>FIT</span></Link>
        <p>Build Your Body. Build Your Life.</p>
      </div>
      <div className="footer-links">
        {NAV.slice(1).map((l) => <Link key={l.to} to={l.to}>{l.label}</Link>)}
      </div>
      <small>© {new Date().getFullYear()} BE FIT. General fitness information only. Talk to a doctor before starting a new program.</small>
    </footer>
  );
}
