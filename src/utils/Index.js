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
