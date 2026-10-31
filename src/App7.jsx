import { useState, useEffect } from "react";
import axios from "axios";
import "./App7.css";

const API_URL = "const API_URL = /tvmaze/search/shows";

function App7() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("cartoon");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  // Fetch cartoons from API using Axios
  useEffect(() => {
    const controller = new AbortController();

    async function getMovies() {
      try {
        setLoading(true);
        setError("");
        setMovies([]);

        const response = await axios.get(API_URL, {
          params: { q: query },
          signal: controller.signal,
          timeout: 3000,
        });
         
        console.log("Axios API Response:", response.data);

        const results = response.data
          .map((item) => item.show)
          .filter((show) => show.image?.medium);

        setMovies(results);
      } catch (err) {
        if (axios.isCancel(err)) return;

        console.error("API Error:", err);
        setError("API data loading is Failed. try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getMovies();

    return () => controller.abort();
  }, [query]);

  function handleSearch(e) {
    e.preventDefault();

    if (search.trim()) {
      setQuery(search.trim());
    }
  }

  function searchCartoon(name) {
    setSearch(name);
    setQuery(name);
  }

  return (
    <div className="a7-app">
      <header className="a7-header">
        <div className="a7-logo">
          <span>▶</span> CartoonNetwork
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
        </nav>

        <span className="a7-header-tag">AXIOS API PROJECT</span>
      </header>

      <section className="a7-hero" id="home">
        <div className="a7-hero-content">
          <span className="a7-eyebrow">
            DISCOVER YOUR FAVORITE CARTOONS
          </span>

          <h1>
            Explore the world
            <br />
            of <span>cartoons.</span>
          </h1>

          <p>
            Search Ben 10, Doraemon, Pokémon, Tom and Jerry
            and many more animated TV shows.
          </p>

          <form className="a7-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search cartoon name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search →</button>
          </form>
        </div>

        <div className="a7-hero-art">
          <span>★</span>
          <strong>TOON</strong>
          <strong>WORLD</strong>
          <small>DISCOVER · EXPLORE · ENJOY</small>
        </div>
      </section>

      <main className="a7-main" id="explore">
        <div className="a7-heading">
          <div>
            <span className="a7-eyebrow">EXPLORE COLLECTION</span>
            <h2>Cartoon Shows</h2>
            <p>
              Search results for <b>{query}</b>
            </p>
          </div>

          <div className="a7-api-status">
            <span className="a7-dot"></span>
            CN API
          </div>
        </div>

        <div className="a7-quick-search">
          {[
            "Ben 10",
            "Doraemon",
            "Pokémon",
            "Tom and Jerry",
            "Scooby-Doo",
            "Powerpuff Girls",
          ].map((name) => (
            <button
              key={name}
              className={query === name ? "active" : ""}
              onClick={() => searchCartoon(name)}
            >
              {name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="a7-message">
            <div className="a7-spinner"></div>
            <h3>Loading Cartoons...</h3>
            <p>Fetching live data using Axios API</p>
          </div>
        )}

        {!loading && error && (
          <div className="a7-message">
            <h3>Something went wrong</h3>
            <p>{error}</p>

            <button
              onClick={() => setQuery(query + " ")}
              className="a7-btn"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="a7-count">
              {movies.length} shows found with posters
            </div>

            <div className="a7-grid">
              {movies.map((movie) => (
                <article className="a7-card" key={movie.id}>
                  <div className="a7-poster">
                    <img
                      src={movie.image.medium}
                      alt={movie.name}
                      loading="lazy"
                    />

                    {movie.rating?.average != null && (
                      <span className="a7-rating">
                        ★ {movie.rating.average}/10
                      </span>
                    )}
                  </div>

                  <div className="a7-card-body">
                    <h3>{movie.name}</h3>

                    <p>
                      {movie.premiered?.slice(0, 4) ||
                        "Year unavailable"}
                    </p>

                    <div className="a7-card-footer">
                      <span>
                        {movie.genres?.[0] || "TV Show"}
                      </span>

                      <button onClick={() => setSelected(movie)}>
                        Details →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {movies.length === 0 && (
              <div className="a7-message">
                <h3>No cartoon posters found</h3>
                <p>
                  Indha search-ku API-la image irukkura shows
                  kidaikkala. Vera cartoon search pannu.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <div
          className="a7-overlay"
          onClick={() => setSelected(null)}
        >
          <div
            className="a7-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="a7-close"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <img
              src={selected.image?.original ||
                selected.image?.medium}
              alt={selected.name}
            />

            <div className="a7-modal-content">
              <span className="a7-eyebrow">
                SHOW INFORMATION
              </span>

              <h2>{selected.name}</h2>

              <p>
                <b>Year:</b>{" "}
                {selected.premiered?.slice(0, 4) || "N/A"}
              </p>

              <p>
                <b>Language:</b>{" "}
                {selected.language || "N/A"}
              </p>

              <p>
                <b>Rating:</b>{" "}
                {selected.rating?.average ?? "N/A"}
              </p>

              <p>
                <b>Genres:</b>{" "}
                {selected.genres?.join(", ") || "N/A"}
              </p>

              <div
                className="a7-description"
                dangerouslySetInnerHTML={{
                  __html:
                    selected.summary ||
                    "Description unavailable.",
                }}
              />

              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                className="a7-btn"
              >
                View on KidShow ↗
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="a7-footer">
        <h2>CartoonNetwork</h2>
        <p>Enjoy | snacks | Watch </p>
        <small>TV data provided by CN</small>
      </footer>
    </div>
  );
}

export default App7;
