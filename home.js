function closeMovie() {
  let singleMovie = document.getElementById('singleMovie');
  if (singleMovie) {
    singleMovie.style.display = 'none';
    singleMovie.remove();
  }

  let searchResult = document.getElementById('searchResult');
  if (searchResult) {
    searchResult.style.display = 'flex';
  }
}

function showSingleMovie(movie) {
  console.log(movie);
  let searchResult = document.getElementById('searchResult');
  searchResult.style.display = 'none';
  let singleMovie = document.createElement('singleMovie');
  singleMovie.id = 'singleMovie';

  let container = document.querySelector('.container');
  singleMovie.innerHTML = `
	<span class="cross" onclick="closeMovie()"><i class="fas fa-times"></i></span>
  <div class="card_left">
	<img
	  src="${movie.Poster}"
	  alt=""
	/>
  </div>
  <div class="card_right">
	<h1>${movie.Title}</h1>
	<ul class="card_right-details">
	  <li>${movie.Year}</li>
	  <li>${movie.Runtime}</li>
	  <li>${movie.Genre.split(',')[0]}</li>
	</ul>
	<div class="card_right-rating">IMDB Rating: ${movie.imdbRating}/10</div>
	<p class="card_right-review">
	  ${movie.Plot}
	</p>
	<button class="card_right-button">Watch Trailer</button>
  </div>`;

  container.append(singleMovie);
}

// Return full movie object
async function getFullDetail(url) {
  let res = await fetch(url);
  let body = await res.json();
  return body;
}

// Create card
async function createCard(movie) {
  let fullMovie = await getFullDetail(
    `https://www.omdbapi.com/?t=${movie['Title']}&apikey=f4705056`
  );
  // console.log('fullMovie:', fullMovie);
  console.log(fullMovie.imdbRating);

  let card = document.createElement('div');
  card.classList.add('card');
  card.onclick = function () {
    showSingleMovie(fullMovie);
  };
  card.innerHTML = `
  ${
    Number(fullMovie.imdbRating) > 8.5
      ? `<span class="recommended"><i class="fas fa-star"></i> Recommended</span>`
      : ``
  }
  <img
	class="cardImage"
	src="${movie['Poster']}"
	alt=""
  />
  <div class="content">
	<h3 class="cardTitle">
	  ${movie['Title']}
	</h3>
	<span class="cardProduction"
	  > ${
      fullMovie.Production ? fullMovie.Production.trim().split(',')[0] : 'N / A'
    } <i class="fas fa-check-circle"></i
	></span>
	<span class="cardRelease">Release: ${fullMovie.Released}</span>
	<span class="cardPlayTime">${fullMovie.Runtime}</span>
  </div>`;

  return card;
}

async function displayMovies(movies) {
  let searchResult = document.getElementById('searchResult');
  searchResult.innerHTML = null;

  let singleMovie = document.getElementById('singleMovie');
  if (singleMovie) {
    singleMovie.remove();
  }

  for (let i = 0; i < movies.length; i++) {
    let card = await createCard(movies[i]);
    searchResult.append(card);
  }
}

// API LINK With Key - https://www.omdbapi.com/?i=tt3896198&apikey=f4705056
async function getMovie(e) {
  e.preventDefault();
  try {
    let errorDiv = document.getElementById('movieError');
    if (errorDiv) {
      errorDiv.innerHTML = null;
    }
    let title = document.getElementById('title').value;
    let response = await fetch(
      `https://www.omdbapi.com/?s=${title}&apikey=f4705056`
    );
    let movies = await response.json();
    console.log('movies:', movies);
    if (movies.Response == 'True') {
      displayMovies(movies.Search);
    } else {
      closeMovie();
      let searchResult = document.getElementById('searchResult');
      if (searchResult) {
        searchResult.innerHTML = null;
      }
      let movieError = document.getElementById('movieError');
      movieError.innerHTML = `
      <img src="./notFound.gif" alt="">
      <h1>Oops, try searching something else.</h1>
      `;
      setTimeout(function () {
        movieError.innerHTML = `
        <img src="./notFound1.gif" alt="">
        <h1>Don't make this face, search another thing.</h1>
        `;
      }, 2000);
    }
  } catch (err) {
    console.log(err);

    console.log(err);
  }
}
