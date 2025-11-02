const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log(id);

async function getfilmdetail(id) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjg3OWE4YTNmYzIwMzgyZTE2YjE4NDI0M2Y4OTZmZCIsIm5iZiI6MTc2MDg1OTEyOC40NzgwMDAyLCJzdWIiOiI2OGY0OTNmOGEwZDEzNWIwZjFmOTljN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.tYI6cTymZp8I5NwfGXVfMHIAyf1YMO-wpHOeURL9lSI",
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  );
  const data = await res.json();
  return data;
}

const data = await getfilmdetail(id);
console.log(data);


const main = document.getElementById("main");

const film = data;

main.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" alt="${film.title}" />
    <div class="movie-info">
    <h1 class="title">${film.title}</h1>
    <p class="tagline"><i>"${film.tagline}"</i></p>
    <p class="overview">${film.overview}</p>
    <p class="release-date"><span>Release Date: </span>${film.release_date}</p>
    <p class="runtime"><span>Runtime: </span>${film.runtime} minutes</p>
    <p class="language"><span>Language: </span>${film.original_language.toUpperCase()}</p>
    <p class="rating"><span>Rating: </span>${film.vote_average} / 10 (${film.vote_count} votes)</p>
    <p class="genres"><span>Genres: </span>${film.genres.map((genre) => genre.name).join(", ")}</p>
    <p class="country"><span>Country: </span>${film.origin_country}</p>

    </div>
    `;
