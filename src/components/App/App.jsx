import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation.jsx";
import Home from "../Home/Home.jsx";
import About from "../About/About.jsx";
import Standings from "../Standings/Standings.jsx";
import Footer from "../Footer/Footer.jsx";
import {
  getFinishedGames,
  getStandings,
} from "../../utils/BigBallsSportsApi.js";
import "./App.css";

const GAMES_TO_SHOW = 12;

export default function App() {
  // Search (Home page)
  const [allGames, setAllGames] = useState(null); // fetched once, then searched locally
  const [results, setResults] = useState({ query: "", games: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Standings page
  const [standings, setStandings] = useState(null); // null = not loaded yet
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const [standingsError, setStandingsError] = useState("");
  const [standingsAttempt, setStandingsAttempt] = useState(0); // bump to retry

  // Load the standings when the app opens (and again on "Try again").
  useEffect(() => {
    let ignore = false; // ignore a response that arrives after a newer request
    setIsLoadingStandings(true);
    setStandingsError("");

    getStandings()
      .then((data) => {
        if (ignore) return;
        // data.standings holds the league table (or a list with one table in it).
        const table = Array.isArray(data.standings)
          ? data.standings[0]
          : data.standings;
        const rows = table && table.rows ? table.rows : [];
        // Best record first.
        setStandings(
          [...rows].sort((a, b) => (b.win_pct ?? -1) - (a.win_pct ?? -1)),
        );
      })
      .catch((err) => {
        if (ignore) return;
        setStandingsError(err.message);
      })
      .finally(() => {
        if (ignore) return;
        setIsLoadingStandings(false);
      });

    return () => {
      ignore = true;
    };
  }, [standingsAttempt]);

  // Passed down to the Standings page's retry button.
  function handleRetryStandings() {
    setStandingsAttempt((attempt) => attempt + 1);
  }

  // Passed down to SearchForm (through Home and Header).
  function handleSearch(query) {
    setIsLoading(true);
    setError("");
    setHasSearched(true);

    // The free plan has a daily request limit, so only call the API the first time.
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
          .sort((a, b) => b.kickoff_utc.localeCompare(a.kickoff_utc))
          .slice(0, GAMES_TO_SHOW);

        setResults({ query, games: found });
      })
      .catch((err) => {
        setResults({ query, games: [] });
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
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
                onRetry={handleRetryStandings}
              />
            }
          />
          <Route path="/about" element={<About />} />
          {/* Unknown URLs go back to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
