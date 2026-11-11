import { useState } from "react";
import Preloader from "../Preloader/Preloader.jsx";
import "./CourtWeather.css";

// Plain-English label for the weather codes Open-Meteo returns.
function describeWeather(code) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code === 85 || code === 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

// A quick call on whether the outdoor courts are playable right now.
function getVerdict(current) {
  const isWet = current.precipitation > 0 || current.weather_code >= 51;

  if (isWet) {
    return { text: "Wet courts. Better to play indoors today.", isGood: false };
  }
  if (current.temperature_2m < 40) {
    return { text: "Too cold for a comfortable run.", isGood: false };
  }
  if (current.temperature_2m > 95) {
    return { text: "Dangerously hot. Wait for the evening.", isGood: false };
  }
  if (current.wind_speed_10m > 20) {
    return { text: "Windy. Your shots will drift.", isGood: false };
  }
  return { text: "Good conditions for an outdoor run.", isGood: true };
}

export default function CourtWeather({
  weather,
  isLoading,
  error,
  hasSearched,
  onSearch,
}) {
  const [city, setCity] = useState("");
  const [formError, setFormError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = city.trim();

    if (!trimmed) {
      setFormError("Enter a city to search.");
      return;
    }

    setFormError("");
    onSearch(trimmed);
  }

  function renderResult() {
    if (isLoading) {
      return <Preloader text="Loading weather" />;
    }
    if (error) {
      return (
        <p
          className="court-weather__message court-weather__message_error"
          role="alert"
        >
          {error}
        </p>
      );
    }
    if (!weather) {
      return (
        <div className="court-weather__empty">
          <h2 className="court-weather__empty-title">Nothing found</h2>
          <p className="court-weather__message">
            Sorry, but nothing matched your search terms.
          </p>
        </div>
      );
    }

    const { place, current } = weather;
    const verdict = getVerdict(current);
    const placeName = [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(", ");

    return (
      <div className="court-weather__card">
        <h2 className="court-weather__place">{placeName}</h2>
        <p className="court-weather__temp">
          {Math.round(current.temperature_2m)}°F
        </p>
        <p className="court-weather__summary">
          {describeWeather(current.weather_code)}
        </p>
        <ul className="court-weather__details">
          <li className="court-weather__detail">
            <span>Feels like</span>
            <span>{Math.round(current.apparent_temperature)}°F</span>
          </li>
          <li className="court-weather__detail">
            <span>Wind</span>
            <span>{Math.round(current.wind_speed_10m)} mph</span>
          </li>
          <li className="court-weather__detail">
            <span>Precipitation</span>
            <span>{current.precipitation > 0 ? "Falling" : "None"}</span>
          </li>
        </ul>
        <p
          className={
            verdict.isGood
              ? "court-weather__verdict court-weather__verdict_good"
              : "court-weather__verdict court-weather__verdict_poor"
          }
        >
          {verdict.text}
        </p>
      </div>
    );
  }

  return (
    <main className="court-weather">
      <h1 className="court-weather__title">Court Weather</h1>
      <p className="court-weather__text">
        Check the conditions before you head to the outdoor courts.
      </p>
      <form className="court-weather__form" onSubmit={handleSubmit} noValidate>
        <label className="court-weather__label" htmlFor="weather-city">
          City
        </label>
        <input
          id="weather-city"
          className="court-weather__input"
          type="search"
          placeholder="Try Cincinnati"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="button button_solid"
          type="submit"
          disabled={isLoading}
        >
          Check weather
        </button>
      </form>
      {formError && (
        <p
          className="court-weather__message court-weather__message_error"
          role="alert"
        >
          {formError}
        </p>
      )}
      {hasSearched && (
        <section className="court-weather__result">{renderResult()}</section>
      )}
    </main>
  );
}
