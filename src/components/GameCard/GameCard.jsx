import "./GameCard.css";

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GameCard({
  game,
  isLoggedIn,
  isSaved,
  onToggleSave,
  savedLabel = "Saved",
}) {
  const homeScore = game.score ? game.score.home : null;
  const awayScore = game.score ? game.score.away : null;
  const hasScores = homeScore !== null && awayScore !== null;
  const homeWon = hasScores && homeScore > awayScore;
  const awayWon = hasScores && awayScore > homeScore;

  const rows = [
    { team: game.away, score: awayScore, won: awayWon },
    { team: game.home, score: homeScore, won: homeWon },
  ];

  return (
    <li className="game-card">
      <div className="game-card__top">
        <p className="game-card__meta">{formatDate(game.kickoff_utc)}</p>
        <button
          className={
            isSaved
              ? "game-card__save game-card__save_active"
              : "game-card__save"
          }
          type="button"
          aria-pressed={isSaved}
          title={isLoggedIn ? undefined : "Sign in to save games"}
          onClick={() => onToggleSave(game)}
        >
          {isSaved ? savedLabel : "Save"}
        </button>
      </div>
      {rows.map(({ team, score, won }) => (
        <p
          key={team.id}
          className={
            won ? "game-card__row game-card__row_winner" : "game-card__row"
          }
        >
          <span className="game-card__team">{team.name}</span>
          <span className="game-card__score">
            {score === null ? "-" : score}
          </span>
        </p>
      ))}
    </li>
  );
}
