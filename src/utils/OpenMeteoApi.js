const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Error: ${res.status} ${res.statusText}`));
}

// City name -> { name, admin1, country, latitude, longitude }, or null when nothing matches.
export function getCoordinates(city) {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`;
  return fetch(url)
    .then(checkResponse)
    .then((data) =>
      data.results && data.results.length > 0 ? data.results[0] : null,
    );
}

// Current conditions for a pair of coordinates.
export function getCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
  });
  return fetch(`${FORECAST_URL}?${params}`)
    .then(checkResponse)
    .then((data) => data.current);
}
