import SearchForm from "../SearchForm/SearchForm.jsx";
import "./Header.css";

export default function Header({ onSearch, isLoading }) {
  return (
    <section className="header">
      <img
        className="background__image"
        src="/HoopCityPro.png"
        alt=""
        aria-hidden="true"
      />
      <div className="header__body">
        <h1 className="header__title">{"Don't just play. Be seen."}</h1>
        <p className="header__text">
          Look up any HoopCityPro team and see how its latest games ended.
        </p>
        <SearchForm onSearch={onSearch} isLoading={isLoading} />
      </div>
    </section>
  );
}
