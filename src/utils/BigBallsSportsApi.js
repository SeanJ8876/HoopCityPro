const BASE_URL = "https://api.bigballsdata.com";
const API_KEY = "bbs_live_00000cwC0PI8cLI9TAd8oXY8HpdDWXgmMPj7rgqqQeWCvxYA";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  if (res.status === 401) {
    return Promise.reject(
      new Error("The API key is missing or invalid. Check your .env file."),
    );
  }
  if (res.status === 429) {
    return Promise.reject(
      new Error("Request limit reached. Wait a little and try again."),
    );
  }

  return res
    .json()
    .catch(() => ({}))
    .then((body) =>
      Promise.reject(
        new Error(
          (body.error && body.error.message) ||
            `Something went wrong (error ${res.status}). Please try again.`,
        ),
      ),
    );
}

function handleNetworkError(err) {
  if (err instanceof TypeError) {
    throw new Error(
      "Can't reach the server. Check your connection and try again.",
    );
  }
  throw err;
}

function request(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return fetch(url, { headers: { Authorization: `Bearer ${API_KEY}` } })
    .then(checkResponse)
    .catch(handleNetworkError);
}

export function getStandings() {
  return request("/v1/standings", { league: "nba" }).then((res) => res.data);
}

export function getFinishedGames() {
  return request("/v1/matches", {
    sport: "basketball",
    league: "nba",
    status: "finished",
    limit: 200,
  }).then((res) => res.data);
}

fetch(
  "https://api.bigballsdata.com/v1/matches?sport=basketball&league=nba&status=finished&limit=5",
  {
    headers: {
      Authorization:
        "Bearer bbs_live_00000cwC0PI8cLI9TAd8oXY8HpdDWXgmMPj7rgqqQeWCvxYA",
    },
  },
)
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
