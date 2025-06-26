// API 1:  http://www.omdbapi.com/?i=tt3896198&apikey=347aa7fa

const minSlider = document.getElementById("priceMin");
const maxSlider = document.getElementById("priceMax");
const minDisplay = document.getElementById("minPrice");
const maxDisplay = document.getElementById("maxPrice");

minSlider.addEventListener("input", updateRange);
maxSlider.addEventListener("input", updateRange);

function updateRange() {
  let minVal = parseInt(minSlider.value);
  let maxVal = parseInt(maxSlider.value);

  if (minVal > maxVal) {
    // Swap values if they cross
    [minVal, maxVal] = [maxVal, minVal];
  }

  minDisplay.textContent = `$${minVal.toLocaleString()}`;
  maxDisplay.textContent = `$${maxVal.toLocaleString()}`;
}

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
            <i class="fas fa-star" aria-hidden="true"></i>
            <i class="fas fa-star" aria-hidden="true"></i>
            <i class="fas fa-star" aria-hidden="true"></i>
            <i class="fas fa-star" aria-hidden="true"></i>
            <i class="fas fa-star" aria-hidden="true"></i>
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

function filterMovies(event) {
  renderMovies(event.target.value);
}
