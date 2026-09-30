import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import "./Home.css";

export default function Home({
  onSearch,
  results,
  isLoading,
  error,
  hasSearched,
  visibleCount,
  onShowMore,
  isLoggedIn,
  savedGames,
  onToggleSave,
}) {
  return (
    <main className="home">
      <Header onSearch={onSearch} isLoading={isLoading} />
      <Main
        results={results}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
        visibleCount={visibleCount}
        onShowMore={onShowMore}
        isLoggedIn={isLoggedIn}
        savedGames={savedGames}
        onToggleSave={onToggleSave}
      />
    </main>
  );
}
