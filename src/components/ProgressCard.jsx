import TiltCard3D from './TiltCard3D';

export default function ProgressCard({ icon, label, value, pct }) {
  return (
    <TiltCard3D>
      <div className="card card-3d-inner">
        <div className="card-top">
          <div className="icon-box icon-box-3d">{icon}</div>
          <span className="pct">{pct}%</span>
        </div>
        <p className="muscle">{label}</p>
        <h3 className="big">{value}</h3>
        <div className="bar">
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>
    </TiltCard3D>
  );
}
