import { Link, NavLink } from "react-router-dom";
import "./Navigation.css";

function linkClass({ isActive }) {
  return isActive
    ? "navigation__link navigation__link_active"
    : "navigation__link";
}

export default function Navigation() {
  return (
    <header className="navigation">
      <Link className="navigation__brand" to="/">
        Hoop<span className="navigation__brand-accent">City</span>Pro
      </Link>
      <nav className="navigation__links">
        <NavLink className={linkClass} to="/" end>
          Home
        </NavLink>
        <NavLink className={linkClass} to="/about">
          About
        </NavLink>
      </nav>
    </header>
  );
}
