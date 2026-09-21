import Header from "../Header/Header.jsx";
import Main from "../Main/Main.jsx";
import Highlights from "../Highlights/Highlights.jsx";

export default function Home({
  onSearch,
  results,
  isLoading,
  error,
  hasSearched,
}) {
  return (
    <main>
      <Header onSearch={onSearch} isLoading={isLoading} />
      <Main
        results={results}
        isLoading={isLoading}
        error={error}
        hasSearched={hasSearched}
      />
      <Highlights />
    </main>
  );
}
