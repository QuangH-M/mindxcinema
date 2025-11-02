const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjg3OWE4YTNmYzIwMzgyZTE2YjE4NDI0M2Y4OTZmZCIsIm5iZiI6MTc2MDg1OTEyOC40NzgwMDAyLCJzdWIiOiI2OGY0OTNmOGEwZDEzNWIwZjFmOTljN2YiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.tYI6cTymZp8I5NwfGXVfMHIAyf1YMO-wpHOeURL9lSI",
  },
};

async function getData() {
  const res = await fetch(
    "https://api.themoviedb.org/3/trending/movie/day?language=en-US",
    options
  );
  const data = await res.json();
  return data.results;
}

const data = await getData();
console.log(data);

const listfilm = document.getElementById("listfilm");

for (let i = 0; i < data.length; i++) {
  const film = data[i];
  const card = document.createElement("div");
  card.className = "movie-card";

  card.innerHTML = `
    <a href="info.html?id=${film.id}">
        <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" alt="${film.title}" />
        <h3 class="movie-title">${film.title}</h3>
        <small class="movie-language">Language: ${film.original_language}</small>
    </a>
    `;
  listfilm.appendChild(card);
}
