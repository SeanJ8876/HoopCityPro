import { useState } from "react";
import "./SearchForm.css";

export default function SearchForm({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Enter a team name to search.");
      return;
    }

    setError("");
    onSearch(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="search-form__row">
        <label className="search-form__label" htmlFor="team-search">
          Team name
        </label>
        <input
          id="team-search"
          className="search-form__input"
          type="search"
          placeholder="Try HoopCityPro Teams"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="button button_solid"
          type="submit"
          disabled={isLoading}
        >
          Search
        </button>
      </div>
      {error && (
        <p className="search-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
