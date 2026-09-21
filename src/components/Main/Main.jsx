import Preloader from "../Preloader/Preloader.jsx";
import GameCard from "../GameCard/GameCard.jsx";
import "./Main.css";

// Search results: preloader, error, "Nothing found", or the games (3 at a time).
export default function Main({
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
  const { query, games } = results;

  if (!hasSearched) {
    return null;
  }

  function renderResults() {
    if (isLoading) {
      return <Preloader />;
    }
    if (error) {
      return (
        <p className="main__message main__message_error" role="alert">
          {error}
        </p>
      );
    }
    if (games.length === 0) {
      return (
        <div className="main__empty">
          <h2 className="main__empty-title">Nothing found</h2>
          <p className="main__message">
            Sorry, but nothing matched your search terms.
          </p>
        </div>
      );
    }
    return (
      <>
        <h2 className="main__title">{`Latest games for "${query}"`}</h2>
        <ul className="main__list">
          {games.slice(0, visibleCount).map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isLoggedIn={isLoggedIn}
              isSaved={savedGames.some((saved) => saved.id === game.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </ul>
        {games.length > visibleCount && (
          <button
            className="button button_outline main__more"
            type="button"
            onClick={onShowMore}
          >
            Show more
          </button>
        )}
      </>
    );
  }

  return <section className="main__results">{renderResults()}</section>;
}
