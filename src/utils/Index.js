import ThirdPartyApi from "./utils/ThirdPartyApi.js";

const api = new ThirdPartyApi({
  baseUrl: "",
  apiKey: "",
});

const list = document.querySelector(".");

function renderCard({ name, link }) {
  const item = document.createElement("");
  item.className = "";

  const img = document.createElement("");
  img.src = link;
  img.alt = name;

  const title = document.createElement("");
  title.textContent = name;

  item.append(img, title);
  return item;
}

api
  .getInitialCards()
  .then((cards) => {
    list.append(cards.map(renderCard));
  })
  .catch((err) => {
    console.error(err);
    list.textContent = "Could not load cards. Please try again later.";
  });

fetch("https://geocoding-api.open-meteo.com/v1/search?name=Cincinnati&count=1")
  .then((r) => r.json())
  .then((d) => {
    const { latitude, longitude } = d.results[0];
    return fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`,
    );
  })
  .then((r) => r.json())
  .then(console.log);
