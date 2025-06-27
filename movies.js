const moviesListEl = document.querySelector(".movies");
const apiKey = "347aa7fa";
const movieIds = [
  "tt0133093",
  "tt0110912",
  "tt0111161",
  "tt3896198",
  "tt1375666",
  "tt0137523",
]; // The Matrix, Pulp Fiction, Shawshank, etc.

let movies = [];

// Fetch all movies and render on load
async function fetchAndStoreMovies() {
  const promises = movieIds.map((id) =>
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then((res) =>
      res.json()
    )
  );
  movies = await Promise.all(promises);
  renderMovies(movies); // render all on load
}

fetchAndStoreMovies();

// Render a list of movies
function renderMovies(movieArray) {
  const wrapper = document.querySelector(".movies");

  if (!movieArray || movieArray.length === 0) {
    wrapper.innerHTML = `<p class="no-results">No matching movies found.</p>`;
    return;
  }

  const moviesHTML = movieArray
    .map((movie) => {
      return ` 
        <div class="movie">
          <div class="movie__img-wrapper">
            <img src="${movie.Poster}" class="movie__img" />
          </div>
          <h3 class="movie__title">${movie.Title}</h3>
          <h4 class="movie__year">${movie.Year}</h4>
          <h4 class="movie__imdb">${movie.imdbRating}</h4>
          <div class="movie__ratings">
            ${ratingsHTML(movie.imdbRating)}
          </div>
          <p class="movie__para">${movie.Plot}</p>
        </div>`;
    })
    .join("");

  wrapper.innerHTML = moviesHTML;
}

// Sort dropdown handler
document.getElementById("filter").addEventListener("change", (e) => {
  const filter = e.target.value;
  let sortedMovies = [...movies];

  if (filter === "ALPHA") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter === "YEAR") {
    sortedMovies.sort((a, b) => {
      const yearA = parseInt(a.Year.split("–")[0]) || 0;
      const yearB = parseInt(b.Year.split("–")[0]) || 0;
      return yearA - yearB;
    });
  } else if (filter === "RATING") {
    sortedMovies.sort(
      (a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating)
    );
  }

  renderMovies(sortedMovies);
});

// Search input handler
document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      renderMovies(movies); // Reset to full list if input is blank
      return;
    }

    const match = movies.find(
      (movie) => movie.Title.toLowerCase() === query
    );

    renderMovies(match ? [match] : []);
  }
});

// Optional burger menu toggle
function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("active");
}

// Star rating renderer
function ratingsHTML(rating) {
  const rating_half = rating / 2;
  let ratingHTML = "";

  for (let i = 0; i < Math.floor(rating_half); ++i) {
    ratingHTML += '<i class="fas fa-star"></i>\n';
  }

  if (!Number.isInteger(rating_half)) {
    ratingHTML += '<i class="fas fa-star-half-alt"></i>\n';
  }

  return ratingHTML;
}
