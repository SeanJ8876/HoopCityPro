import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation.jsx";
import Home from "../Home/Home.jsx";
import About from "../About/About.jsx";
import Standings from "../Standings/Standings.jsx";
import CourtWeather from "../CourtWeather/CourtWeather.jsx";
import SavedGames from "../SavedGames/SavedGames.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import Footer from "../Footer/Footer.jsx";
import {
  getFinishedGames,
  getStandings,
} from "../../utils/BigBallsSportsApi.js";
import { getCoordinates, getCurrentWeather } from "../../utils/OpenMeteoApi.js";
import {
  register,
  login,
  checkToken,
  getSavedGames,
  saveGame,
  deleteGame,
} from "../../utils/MainApi.js";
import "./App.css";

const REQUEST_ERROR_MESSAGE =
  "Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.";
const GAMES_PER_PAGE = 3;

export default function App() {
  // Search (Home page)
  const [allGames, setAllGames] = useState(null);
  const [results, setResults] = useState({ query: "", games: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE);

  // Standings page
  const [standings, setStandings] = useState(null);
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const [standingsError, setStandingsError] = useState("");
  const [standingsAttempt, setStandingsAttempt] = useState(0);
  const [standingsVisibleCount, setStandingsVisibleCount] =
    useState(GAMES_PER_PAGE);

  // Court Weather page
  const [weather, setWeather] = useState(null); // { place, current } or null
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [hasSearchedWeather, setHasSearchedWeather] = useState(false);

  // Account (simulated backend)
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [savedGames, setSavedGames] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // "login" | "register" | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  // Restore the session from a saved token on load.
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setIsAuthChecked(true);
      return;
    }

    Promise.all([checkToken(token), getSavedGames(token)])
      .then(([user, saved]) => {
        setCurrentUser(user);
        setSavedGames(saved);
        setIsLoggedIn(true);
      })
      .catch(() => localStorage.removeItem("jwt"))
      .finally(() => setIsAuthChecked(true));
  }, []);

  // Load the standings when the app opens (and again on "Try again").
  useEffect(() => {
    let ignore = false;
    setIsLoadingStandings(true);
    setStandingsError("");

    getStandings()
      .then((data) => {
        if (ignore) return;
        const table = Array.isArray(data.standings)
          ? data.standings[0]
          : data.standings;
        const rows = table && table.rows ? table.rows : [];
        setStandings(
          [...rows].sort((a, b) => (b.win_pct ?? -1) - (a.win_pct ?? -1)),
        );
      })
      .catch((err) => {
        if (ignore) return;
        console.error(err);
        setStandingsError(REQUEST_ERROR_MESSAGE);
      })
      .finally(() => {
        if (ignore) return;
        setIsLoadingStandings(false);
      });

    return () => {
      ignore = true;
    };
  }, [standingsAttempt]);

  function openModal(name) {
    setAuthError("");
    setAuthNotice("");
    setActiveModal(name);
  }

  function closeModal() {
    setActiveModal(null);
  }

  function handleRegister({ name, email, password }) {
    setIsSubmitting(true);
    setAuthError("");

    register({ name, email, password })
      .then(() => {
        setAuthNotice("Registration complete. Please sign in.");
        setActiveModal("login");
      })
      .catch((err) => setAuthError(err.message))
      .finally(() => setIsSubmitting(false));
  }

  function handleLogin({ email, password }) {
    setIsSubmitting(true);
    setAuthError("");

    login({ email, password })
      .then(({ token }) => {
        localStorage.setItem("jwt", token);
        return Promise.all([checkToken(token), getSavedGames(token)]);
      })
      .then(([user, saved]) => {
        setCurrentUser(user);
        setSavedGames(saved);
        setIsLoggedIn(true);
        setActiveModal(null);
      })
      .catch((err) => setAuthError(err.message))
      .finally(() => setIsSubmitting(false));
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setSavedGames([]);
    setIsLoggedIn(false);
  }

  function handleToggleSave(game) {
    if (!isLoggedIn) {
      openModal("login");
      return;
    }

    const token = localStorage.getItem("jwt");
    const alreadySaved = savedGames.some((saved) => saved.id === game.id);

    const request = alreadySaved
      ? deleteGame(game.id, token).then(() =>
          setSavedGames((prev) => prev.filter((saved) => saved.id !== game.id)),
        )
      : saveGame(game, token).then((saved) =>
          setSavedGames((prev) => [saved, ...prev]),
        );

    request.catch((err) => console.error(err));
  }

  function handleRetryStandings() {
    setStandingsVisibleCount(GAMES_PER_PAGE);
    setStandingsAttempt((attempt) => attempt + 1);
  }

  function handleShowMoreStandings() {
    setStandingsVisibleCount((count) => count + GAMES_PER_PAGE);
  }

  // Passed down to the Court Weather page's search form.
  function handleWeatherSearch(city) {
    setIsLoadingWeather(true);
    setWeatherError("");
    setHasSearchedWeather(true);
    setWeather(null);

    getCoordinates(city)
      .then((place) => {
        if (!place) {
          return; // nothing matched: weather stays null, page shows "Nothing found"
        }
        return getCurrentWeather(place.latitude, place.longitude).then(
          (current) => setWeather({ place, current }),
        );
      })
      .catch((err) => {
        console.error(err);
        setWeatherError(REQUEST_ERROR_MESSAGE);
      })
      .finally(() => setIsLoadingWeather(false));
  }

  function handleSearch(query) {
    setIsLoading(true);
    setError("");
    setHasSearched(true);
    setVisibleCount(GAMES_PER_PAGE);

    const loadGames = allGames
      ? Promise.resolve(allGames)
      : getFinishedGames().then((games) => {
          setAllGames(games);
          return games;
        });

    loadGames
      .then((games) => {
        const q = query.toLowerCase();
        const found = games
          .filter((game) =>
            [
              game.home.name,
              game.home.short_name,
              game.away.name,
              game.away.short_name,
            ].some((name) => name && name.toLowerCase().includes(q)),
          )
          .sort((a, b) => b.kickoff_utc.localeCompare(a.kickoff_utc));

        setResults({ query, games: found });
      })
      .catch((err) => {
        console.error(err);
        setResults({ query, games: [] });
        setError(REQUEST_ERROR_MESSAGE);
      })
      .finally(() => setIsLoading(false));
  }

  function handleShowMore() {
    setVisibleCount((count) => count + GAMES_PER_PAGE);
  }

  return (
    <HashRouter>
      <div className="app">
        <Navigation
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          onSignIn={() => openModal("login")}
          onSignOut={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onSearch={handleSearch}
                results={results}
                isLoading={isLoading}
                error={error}
                hasSearched={hasSearched}
                visibleCount={visibleCount}
                onShowMore={handleShowMore}
                isLoggedIn={isLoggedIn}
                savedGames={savedGames}
                onToggleSave={handleToggleSave}
              />
            }
          />
          <Route
            path="/standings"
            element={
              <Standings
                standings={standings}
                isLoading={isLoadingStandings}
                error={standingsError}
                visibleCount={standingsVisibleCount}
                onShowMore={handleShowMoreStandings}
                onRetry={handleRetryStandings}
              />
            }
          />
          <Route
            path="/weather"
            element={
              <CourtWeather
                weather={weather}
                isLoading={isLoadingWeather}
                error={weatherError}
                hasSearched={hasSearchedWeather}
                onSearch={handleWeatherSearch}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                isAuthChecked={isAuthChecked}
              >
                <SavedGames
                  savedGames={savedGames}
                  onToggleSave={handleToggleSave}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />

        {activeModal === "login" && (
          <LoginModal
            onClose={closeModal}
            onSubmit={handleLogin}
            onSwitch={() => openModal("register")}
            isSubmitting={isSubmitting}
            error={authError}
            notice={authNotice}
          />
        )}
        {activeModal === "register" && (
          <RegisterModal
            onClose={closeModal}
            onSubmit={handleRegister}
            onSwitch={() => openModal("login")}
            isSubmitting={isSubmitting}
            error={authError}
          />
        )}
      </div>
    </HashRouter>
  );
}
