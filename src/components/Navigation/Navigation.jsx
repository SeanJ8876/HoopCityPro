import { Link, NavLink } from "react-router-dom";
import "./Navigation.css";

function linkClass({ isActive }) {
  return isActive
    ? "navigation__link navigation__link_active"
    : "navigation__link";
}

export default function Navigation({
  isLoggedIn,
  currentUser,
  onSignIn,
  onSignOut,
}) {
  return (
    <header className="navigation">
      <Link className="navigation__brand" to="/">
        Hoop<span className="navigation__brand-accent">City</span>Pro
      </Link>
      <nav className="navigation__links">
        <NavLink className={linkClass} to="/" end>
          Home
        </NavLink>
        <NavLink className={linkClass} to="/standings">
          Standings
        </NavLink>
        {isLoggedIn && (
          <NavLink className={linkClass} to="/saved">
            Saved games
          </NavLink>
        )}
        <NavLink className={linkClass} to="/about">
          About
        </NavLink>
      </nav>
      <div className="navigation__account">
        {isLoggedIn ? (
          <>
            <span className="navigation__user">{currentUser.name}</span>
            <button
              className="button button_outline navigation__button"
              type="button"
              onClick={onSignOut}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            className="button button_solid navigation__button"
            type="button"
            onClick={onSignIn}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
