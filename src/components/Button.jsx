import { Link } from 'react-router-dom';
import { useExperience3D } from '../context/Experience3DContext';

export default function Button({
  to,
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  full,
  className = '',
  ...props
}) {
  const { triggerClickAudio, triggerHoverAudio } = useExperience3D();
  const cls = `btn btn-${variant}${full ? ' btn-full' : ''} ${className}`;

  const handleClick = (e) => {
    triggerClickAudio();
    if (onClick) onClick(e);
  };

  const handleMouseEnter = () => {
    triggerHoverAudio();
  };

  if (to) {
    return (
      <Link to={to} className={cls} onClick={handleClick} onMouseEnter={handleMouseEnter} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </button>
  );
}
