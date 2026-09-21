import Preloader from "../Preloader/Preloader.jsx";
import "./Standings.css";

// Win percentage arrives as a ratio (0.723); show it the way box scores do (.723).
function formatPct(pct) {
  return typeof pct === "number" ? pct.toFixed(3).replace(/^0/, "") : "-";
}

export default function Standings({
  standings,
  isLoading,
  error,
  visibleCount,
  onShowMore,
  onRetry,
}) {
  function renderContent() {
    if (isLoading) {
      return <Preloader />;
    }
    if (error) {
      return (
        <div className="standings__status">
          <p
            className="standings__message standings__message_error"
            role="alert"
          >
            {error}
          </p>
          <button
            className="button button_solid"
            type="button"
            onClick={onRetry}
          >
            Try again
          </button>
        </div>
      );
    }
    if (!standings || standings.length === 0) {
      return (
        <div className="standings__status">
          <h2 className="standings__empty-title">Nothing found</h2>
          <p className="standings__message">
            Sorry, there are no standings to show right now.
          </p>
        </div>
      );
    }
    return (
      <>
        <p className="standings__legend">
          Each row shows the record, win percentage, and current streak.
        </p>
        <ol className="standings__list">
          {standings.slice(0, visibleCount).map((row, index) => (
            <li className="standings__item" key={row.team_id}>
              <span className="standings__rank">{index + 1}</span>
              <span className="standings__team">{row.team_name}</span>
              <span className="standings__record">
                {row.wins}-{row.losses}
              </span>
              <span className="standings__pct">{formatPct(row.win_pct)}</span>
              <span className="standings__streak">{row.streak || "-"}</span>
            </li>
          ))}
        </ol>

        {standings.length > visibleCount && (
          <button
            className="button button_outline standings__more"
            type="button"
            onClick={onShowMore}
          >
            Show more
          </button>
        )}
      </>
    );
  }

  return (
    <main className="standings">
      <h1 className="standings__title">NBA standings</h1>
      {renderContent()}
    </main>
  );
}
