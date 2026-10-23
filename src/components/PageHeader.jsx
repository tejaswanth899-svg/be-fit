export default function PageHeader({ title, sub }) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      <p className="lead">{sub}</p>
    </header>
  );
}
