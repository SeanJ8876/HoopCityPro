import "./Preloader.css";

export default function Preloader() {
  return (
    <div className="preloader" role="status">
      <span className="preloader__ball" aria-hidden="true" />
      <p className="preloader__text">Loading games</p>
    </div>
  );
}
