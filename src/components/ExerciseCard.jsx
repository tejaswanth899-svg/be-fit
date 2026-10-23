import TiltCard3D from './TiltCard3D';

export default function ExerciseCard({ e }) {
  return (
    <TiltCard3D>
      <article className="card hover card-3d-inner">
        <div className="card-top">
          <span className="tag">{e.c}</span>
          <span className={`level ${e.d.toLowerCase()}`}>{e.d}</span>
        </div>
        <h3>{e.n}</h3>
        <p className="muscle">Target: {e.m}</p>
        <p>{e.t}</p>
        <div className="sets">
          Sets x reps <b>{e.s}</b>
        </div>
      </article>
    </TiltCard3D>
  );
}
