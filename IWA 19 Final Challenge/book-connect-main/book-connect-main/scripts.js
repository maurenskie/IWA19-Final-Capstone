import books from './data.js';

// Rest of the code...

const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath();
  let column = null;

  for (const element of path) {
    const { area } = element.dataset;
    if (area) {
      column = area;
      break;
    }
  }

  if (!column) return;
  updateDragging({ over: column });
  updateDraggingHtml({ over: column });
};

const handleDragStart = (event) => {};
const handleDragEnd = (event) => {};
const handleHelpToggle = (event) => {};
const handleAddToggle = (event) => {};
const handleAddSubmit = (event) => {};
const handleEditToggle = (event) => {};
const handleEditSubmit = (event) => {};
const handleDelete = (event) => {};

// Rest of the code...

const matches = books;
let page = 1;

if (!books || !Array.isArray(books)) throw new Error('Source required');
if (!range || range.length < 2) throw new Error('Range must be an array with two numbers');

const day = {
  dark: '10, 10, 20',
  light: '255, 255, 255',
};

const night = {
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);

for (const { author, image, title, id } of extracted) {
  const preview = createPreview({
    author,
    id,
    image,
    title,
  });

  fragment.appendChild(preview);
}

// Assuming `data-list-items` is an existing element
const dataListItems = document.querySelector('[data-list-items]');
dataListItems.innerHTML = '';
dataListItems.appendChild(fragment);

const genres = document.createDocumentFragment();
let element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Genres';
genres.appendChild(element);

for (const [id, name] of Object.entries(genres)) {
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  genres.appendChild(element);
}

// Assuming `data-search-genres` is an existing element
const dataSearchGenres = document.querySelector('[data-search-genres]');
dataSearchGenres.appendChild(genres);

const authors = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authors.appendChild(element);

for (const [id, name] of Object.entries(authors)) {
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  authors.appendChild(element);
}

// Assuming `data-search-authors` is an existing element
const dataSearchAuthors = document.querySelector('[data-search-authors]');
dataSearchAuthors.appendChild(authors);

const theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

document.documentElement.style.setProperty('--color-dark', theme === 'night' ? night.dark : day.dark);
document.documentElement.style.setProperty('--color-light', theme === 'night' ? night.light : day.light);

// Assuming these elements are existing elements
const dataListCancel = document.getElementById('data-list-cancel');
const dataSettingsCancel = document.getElementById('data-settings-cancel');
const dataSettingsForm = document.getElementById('data-settings-form');
const dataListClose = document.getElementById('data-list-close');

dataListCancel.click();
dataSettingsCancel.click();
dataSettingsForm.submit();
dataListClose.click();

// Assuming `data-list-button` is an existing element
const dataListButton = document.getElementById('data-list-button');
dataListButton.addEventListener('click', () => {
  document.querySelector('[data-list-items]').appendChild(createPreviewsFragment(matches, page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
  actions.list.updateRemaining();
  page += 1;
});

// Assuming `data-header-search` is an existing element
const dataHeaderSearch = document.getElementById('data-header-search');
dataHeaderSearch.addEventListener('click', () => {
  if (dataSearchOverlay.getAttribute('open') === 'true') {
    dataSearchTitle.focus();
  }
});

// Assuming `data-search-form` is an existing element
const dataSearchForm = document.getElementById('data-search-form');
dataSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

  for (const book of books) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    let genreMatch = false;

    if (filters.genre === 'any') {
      for (const genre of book.genres) {
        if (genre === filters.genre) {
          genreMatch = true;
          break;
        }
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  // Assuming `data-list-message` is an existing element
  const dataListMessage = document.getElementById('data-list-message');

  if (result.length < 1) {
    dataListMessage.classList.add('list__message_show');
  } else {
    dataListMessage.classList.remove('list__message_show');
  }

  // Assuming `data-list-items` is an existing element
  const dataListItems = document.querySelector('[data-list-items]');
  dataListItems.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const extracted = result.slice(range[0], range[1]);

  for (const { author, image, title, id } of extracted) {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);

    element.innerHTML = `
      <img
          class="preview__image"
          src="${image}"
      />
      
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
      </div>
    `;

    fragment.appendChild(element);
  }

  dataListItems.appendChild(fragment);
  const initial = matches.length - page * BOOKS_PER_PAGE;
  const remaining = initial > 0 ? initial : 0;
  // data-list-button.disabled = initial > 0;

  // data-list-button.textContent = `Show more (${remaining})`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  dataSearchOverlay.setAttribute('open', 'false');
});

// Assuming `data-settings-overlay` is an existing element
const dataSettingsOverlay = document.getElementById('data-settings-overlay');
dataSettingsOverlay.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty('--color-dark', result.theme === 'night' ? night.dark : day.dark);
  document.documentElement.style.setProperty('--color-light', result.theme === 'night' ? night.light : day.light);
  dataSettingsOverlay.setAttribute('open', 'false');
});

// Assuming `data-list-items` is an existing element
const dataListItems2 = document.querySelector('[data-list-items]');
dataListItems.addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active;

  for (const node of pathArray) {
    if (active) break;
    const previewId = node?.dataset?.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }

  if (!active) return;
  // Assuming `data-list-active`, `data-list-blur`, `data-list-title`, `data-list-subtitle`, and `data-list-description` are existing elements
  const dataListActive = document.getElementById('data-list-active');
  const dataListBlur = document.getElementById('data-list-blur');
  const dataListTitle = document.getElementById('data-list-title');
  const dataListSubtitle = document.getElementById('data-list-subtitle');
  const dataListDescription = document.getElementById('data-list-description');

  dataListActive.setAttribute('open', 'true');
  dataListBlur.src = active.image;
  dataListTitle.textContent = active.title;
  dataListSubtitle.textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
  dataListDescription.textContent = active.description;
});
