import TiltCard3D from './TiltCard3D';

export default function DietCard({ d }) {
  return (
    <TiltCard3D>
      <div className="card card-3d-inner">
        <div className="icon-box icon-box-3d">{d.icon}</div>
        <h3>{d.title}</h3>
        <ul className="ticks">
          {d.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </TiltCard3D>
  );
}
