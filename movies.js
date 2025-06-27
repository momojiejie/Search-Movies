// API 1:  http://www.omdbapi.com/?i=tt3896198&apikey=347aa7fa

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

let movies;

async function renderMovies(filter) {
  const moviesWrapper = document.querySelector(".movies");

  moviesWrapper.classList += " movies__loading";

  if (!movies) {
    movies = await fetchMovies();
  }
  moviesWrapper.classList.remove("movies__loading");

  if (filter === "ALPHA") {
    movies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (filter === "YEAR") {
    movies.sort((a, b) => {
      const yearA = parseInt(a.Year.split("–")[0]) || 0;
      const yearB = parseInt(b.Year.split("–")[0]) || 0;
      return yearA - yearB;
    });
  } else if (filter === "RATING") {
    movies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
  }

  const moviesHTML = movies
    .map((movie) => {
      return ` <div class="movie">
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

  moviesWrapper.innerHTML = moviesHTML;
}

async function fetchMovies() {
  const promises = movieIds.map((id) =>
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then((res) =>
      res.json()
    )
  );

  const movies = await Promise.all(promises);
  return movies;
}

setTimeout(() => {
  renderMovies();
});

document.getElementById('searchInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    handleSearch(e.target.value);
  }
});


function handleSearch(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    renderMovies([]); // Clear if empty
    return;
  }

  const matchedMovie = movies.find(
    (movie) => movie.Title.toLowerCase() === normalizedQuery
  );

  if (matchedMovie) {
    renderMovies([matchedMovie]);
  } else {
    renderMovies([]); // Nothing found
  }
}
function toggleMenu() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('active');
}

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
