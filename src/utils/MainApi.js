// Simulated backend: stores users and saved games in localStorage.
const USERS_KEY = "hcp_users";
const GAMES_KEY = "hcp_saved_games";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

const fail = (message) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), 300));

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// The "token" is just the user's id, which is fine for a simulated backend.
function userFromToken(token) {
  const users = read(USERS_KEY, []);
  return users.find((u) => u.id === token) || null;
}

export function register({ name, email, password }) {
  const users = read(USERS_KEY, []);
  const normalized = email.trim().toLowerCase();

  if (users.some((u) => u.email === normalized)) {
    return fail("An account with this email already exists.");
  }

  const user = { id: crypto.randomUUID(), name, email: normalized, password };
  write(USERS_KEY, [...users, user]);
  return delay({ name, email: normalized });
}

export function login({ email, password }) {
  const users = read(USERS_KEY, []);
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );

  if (!user) {
    return fail("Incorrect email or password.");
  }

  return delay({ token: user.id });
}

export function checkToken(token) {
  const user = userFromToken(token);
  if (!user) {
    return fail("Invalid token.");
  }
  return delay({ name: user.name, email: user.email });
}

export function getSavedGames(token) {
  const user = userFromToken(token);
  if (!user) {
    return fail("Invalid token.");
  }
  const all = read(GAMES_KEY, {});
  return delay(all[user.id] || []);
}

export function saveGame(game, token) {
  const user = userFromToken(token);
  if (!user) {
    return fail("Invalid token.");
  }
  const all = read(GAMES_KEY, {});
  const mine = all[user.id] || [];
  const saved = { ...game, id: game.id };
  write(GAMES_KEY, { ...all, [user.id]: [saved, ...mine] });
  return delay(saved);
}

export function deleteGame(gameId, token) {
  const user = userFromToken(token);
  if (!user) {
    return fail("Invalid token.");
  }
  const all = read(GAMES_KEY, {});
  const mine = (all[user.id] || []).filter((g) => g.id !== gameId);
  write(GAMES_KEY, { ...all, [user.id]: mine });
  return delay({ id: gameId });
}
