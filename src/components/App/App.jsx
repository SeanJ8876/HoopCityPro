import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
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

const REQUEST_ERROR_MESSAGE =
  "Sorry, something went wrong during the request. There may be a connection issue or the server may be down. Please try again later.";
const GAMES_PER_PAGE = 3;

export default function App() {
  const [allGames, setAllGames] = useState(null);
  const [results, setResults] = useState({ query: "", games: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(GAMES_PER_PAGE);

  const [standings, setStandings] = useState(null);
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const [standingsError, setStandingsError] = useState("");
  const [standingsAttempt, setStandingsAttempt] = useState(0);
  const [standingsVisibleCount, setStandingsVisibleCount] =
    useState(GAMES_PER_PAGE);

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

  function handleRetryStandings() {
    setStandingsVisibleCount(GAMES_PER_PAGE);
    setStandingsAttempt((attempt) => attempt + 1);
  }

  function handleShowMoreStandings() {
    setStandingsVisibleCount((count) => count + GAMES_PER_PAGE);
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
                visibleCount={visibleCount}
                onShowMore={handleShowMore}
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
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
