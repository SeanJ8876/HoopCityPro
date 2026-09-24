import Preloader from "../Preloader/Preloader.jsx";
import "./Standings.css";


function formatPct(pct) {
  return typeof pct === "number" ? pct.toFixed(3).replace(/^0/, "") : "-";
}


function getItemClass(pct) {
  if (typeof pct !== "number") {
    return "standings__item";
  }
  return pct >= 0.5
    ? "standings__item standings__item_winning"
    : "standings__item standings__item_losing";
}

function getStreakClass(streak) {
  if (streak && streak.startsWith("W")) {
    return "standings__streak standings__streak_win";
  }
  if (streak && streak.startsWith("L")) {
    return "standings__streak standings__streak_loss";
  }
  return "standings__streak";
}

export default function Standings({
  standings,
  isLoading,
  error,
  visibleCount,
  onShowMore,
  onRetry,
}) {
  if (isLoading) {
    return (
      <main className="standings">
        <h1 className="standings__title">HoopCity Standings</h1>
        <Preloader text="Loading standings" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="standings">
        <h1 className="standings__title">HoopCity Standings</h1>
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
      </main>
    );
  }

  if (!standings || standings.length === 0) {
    return (
      <main className="standings">
        <h1 className="standings__title">HoopCity Standings</h1>
        <div className="standings__status">
          <h2 className="standings__empty-title">Nothing found</h2>
          <p className="standings__message">
            Sorry, there are no standings to show right now.
          </p>
        </div>
      </main>
    );
  }

  const visibleRows = standings.slice(0, visibleCount);
  const hasMore = standings.length > visibleCount;

  return (
    <main className="standings">
      <h1 className="standings__title">HoopCity Standings</h1>
      <p className="standings__legend">
        Each row shows the record, win percentage, and current streak.
      </p>
      <ol className="standings__list">
        {visibleRows.map((row, index) => (
          <li className={getItemClass(row.win_pct)} key={row.team_id}>
            <span className="standings__rank">{index + 1}</span>
            <span className="standings__team">{row.team_name}</span>
            <span className="standings__record">
              {row.wins}-{row.losses}
            </span>
            <span className="standings__pct">{formatPct(row.win_pct)}</span>
            <span className={getStreakClass(row.streak)}>
              {row.streak || "-"}
            </span>
          </li>
        ))}
      </ol>
      {hasMore && (
        <button
          className="button button_outline standings__more"
          type="button"
          onClick={onShowMore}
        >
          Show more
        </button>
      )}
    </main>
  );
}
