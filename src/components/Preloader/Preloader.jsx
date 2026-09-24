import "./Preloader.css";

export default function Preloader({ text = "Loading games" }) {
  return (
    <div className="preloader" role="status">
      <span className="preloader__ball" aria-hidden="true" />
      <p className="preloader__text">{text}</p>
    </div>
  );
}
