import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <section className="home">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>HoopCityPro</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/Home.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div className="home-highlights">
        <div className="highlight-card">
          <h2>Live Standings</h2>
          <p>See how every division stacks up, updated after each game.</p>
        </div>
        <div className="highlight-card">
          <h2>Game Schedules</h2>
          <p>Never miss a tip-off with our full season calendar.</p>
        </div>
        <div className="highlight-card">
          <h2>Player Stats</h2>
          <p>Track points, assists, and rebounds across the league.</p>
        </div>
      </div>
    </section>
  );
}
