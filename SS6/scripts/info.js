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

// --- Comments feature (injected below the film details) ---
// Uses localStorage key: comments_<filmId>
function injectCommentsStyles() {
  const css = `
  .comments-section { margin-top: 28px; padding: 18px; border-radius: 8px; background: var(--dark-darken); box-shadow: 0 1px 4px rgba(0,0,0,0.06); color: var(--gray-200); }
  .comments-section h2 { margin: 0 0 12px 0; font-size: 20px; color: var(--gray-100); }
  .comment-form { display: flex; gap: 8px; flex-direction: column; }
  .comment-form input[type="text"], .comment-form textarea { width: 100%; padding: 8px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; font-size: 14px; background: var(--dark); color: var(--gray-200); }
  .comment-form textarea { min-height: 72px; resize: vertical; }
  .comment-actions { display:flex; gap:8px; margin-top:6px; }
  .comment-actions button { padding: 8px 12px; border-radius: 4px; border: none; cursor: pointer; }
  .btn-primary { background: var(--red, #e53935); color: #fff; }
  .btn-secondary { background: var(--dark-lighten); color: var(--gray-200); }
  .comments-list { margin-top: 12px; display:flex; flex-direction:column; gap:10px; }
  .comment { padding:10px; border-radius:6px; background: var(--dark-lighten); border:1px solid rgba(255,255,255,0.03); }
  .comment .meta { font-size:12px; color:var(--gray-200); margin-bottom:6px; display:flex; justify-content:space-between; gap:8px; }
  .comment .content { white-space:pre-wrap; font-size:14px; color:var(--gray-200); }
  .comment .controls { margin-top:8px; display:flex; gap:8px; }
  .comment .controls button { padding:6px 8px; font-size:13px; background:#3a3a3a; color:#fff; border-radius:6px; border:1px solid rgba(255,255,255,0.04); cursor:pointer; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}

function commentsStorageKey(filmId) {
  return `comments_${filmId}`;
}

function loadComments(filmId) {
  try {
    const raw = localStorage.getItem(commentsStorageKey(filmId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load comments', e);
    return [];
  }
}

function saveComments(filmId, comments) {
  try {
    localStorage.setItem(commentsStorageKey(filmId), JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
}

function createCommentsSection(filmId) {
  const section = document.createElement('section');
  section.className = 'comments-section';

  section.innerHTML = `
    <h2>Comments</h2>
    <form class="comment-form" data-role="comment-form">
      <input type="text" name="name" placeholder="Your name (optional)" />
      <textarea name="text" placeholder="Write a comment..."></textarea>
      <div class="comment-actions">
        <button type="submit" class="btn-primary">Post comment</button>
        <button type="button" class="btn-secondary" data-action="clear">Clear</button>
      </div>
    </form>
    <div class="comments-list" data-role="comments-list"></div>
  `;

  // event handling
  const form = section.querySelector('[data-role="comment-form"]');
  const commentsList = section.querySelector('[data-role="comments-list"]');

  function render() {
    const comments = loadComments(filmId);
    commentsList.innerHTML = '';
    if (comments.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No comments yet — be the first.';
      empty.style.color = '#666';
      commentsList.appendChild(empty);
      return;
    }

    comments.forEach((c, idx) => {
      const node = document.createElement('div');
      node.className = 'comment';
      node.innerHTML = `
        <div class="meta"><div><strong>${escapeHtml(c.name || 'Anonymous')}</strong></div><div>${new Date(c.ts).toLocaleString()}</div></div>
        <div class="content" data-idx="${idx}">${escapeHtml(c.text)}</div>
        <div class="controls">
          <button data-action="edit" data-idx="${idx}">Edit</button>
          <button data-action="delete" data-idx="${idx}">Delete</button>
        </div>
      `;
      commentsList.appendChild(node);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const text = (formData.get('text') || '').toString().trim();
    if (!text) return alert('Please write a comment first.');
    const comments = loadComments(filmId);
    comments.push({ name: name || 'Anonymous', text, ts: Date.now() });
    saveComments(filmId, comments);
    form.reset();
    render();
  });

  form.querySelector('[data-action="clear"]').addEventListener('click', () => form.reset());

  commentsList.addEventListener('click', (e) => {
    const action = e.target.getAttribute('data-action');
    const idx = e.target.getAttribute('data-idx');
    if (!action) return;
    const comments = loadComments(filmId);
    if (action === 'delete') {
      if (!confirm('Delete this comment?')) return;
      comments.splice(idx, 1);
      saveComments(filmId, comments);
      render();
    } else if (action === 'edit') {
      const c = comments[idx];
      // simple inline edit using prompt for simplicity
      const newText = prompt('Edit comment text:', c.text);
      if (newText === null) return; // cancelled
      c.text = newText.trim();
      c.ts = Date.now();
      saveComments(filmId, comments);
      render();
    }
  });

  render();
  return section;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

try {
  injectCommentsStyles();
  const commentsSection = createCommentsSection(id || 'unknown');
  // insert after the #main element so the comments UI is outside of the main div
  if (main && main.parentNode) {
    main.parentNode.insertBefore(commentsSection, main.nextSibling);
    // align the comments width and left offset to match #main
    function alignCommentsToMain(section) {
      try {
        const mainRect = main.getBoundingClientRect();
        const parent = main.parentNode || document.body;
        const parentRect = parent.getBoundingClientRect ? parent.getBoundingClientRect() : { left: 0 };
        const left = Math.max(0, Math.round(mainRect.left - parentRect.left));
        section.style.boxSizing = 'border-box';
      } catch (err) {
        // ignore alignment errors
        console.warn('Could not align comments to #main', err);
      }
    }

    // initial align and on resize
    alignCommentsToMain(commentsSection);
    window.addEventListener('resize', () => alignCommentsToMain(commentsSection));
  } else {
    // fallback to appending to body if #main not available
    document.body.appendChild(commentsSection);
  }
} catch (e) {
  console.error('Failed to initialize comments section', e);
}

