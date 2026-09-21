import SearchForm from "../SearchForm/SearchForm.jsx";
import Court from "./Court.jsx";
import "./Header.css";

// The spotlight follows the pointer by updating CSS variables (no re-render).
function moveSpotlight(e) {
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - box.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - box.top}px`);
}

export default function Header({ onSearch, isLoading }) {
  return (
    <section className="header" onPointerMove={moveSpotlight}>
      <Court />
      <Court lit />
      <div className="header__body">
        <h1 className="header__title">{"Don't just play. Be seen."}</h1>
        <p className="header__text">
          Look up any NBA team and see how its latest games ended.
        </p>
        <SearchForm onSearch={onSearch} isLoading={isLoading} />
      </div>
    </section>
  );
}
