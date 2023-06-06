function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');

  sidebar.classList.toggle('active');
  container.style.width = sidebar.classList.contains('active') ? 'auto' : '100%';
  container.style.marginLeft = sidebar.classList.contains('active') ? '0' : '-280px';

  if (sidebar.classList.contains('active')) {
    container.style.marginLeft = '340px';
    container.style.marginRight = '40px';
    container.style.marginTop = '50px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 300px))';
    container.style.gridRowGap = '90px';
    container.style.gridColumnGap = '60px';
    container.style.transition = 'transform 0.3s ease-in-out';
  } else {
    container.style.marginLeft = '60px';
    container.style.width = '95%';
    container.style.marginTop = '50px0';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 300px))';
    container.style.gridRowGap = '80px';
    container.style.gridColumnGap = '50px';
    container.style.transition = 'transform 0.3s ease-in-out';
  }
}


const API_KEY = 'api_key=7c69bc4fa25a0ddf37153adac20be8ff';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovieData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    displayMovieData(data.results);
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
}

function truncateText(text, maxLength) {
  if (text.length > 30) {
    return text.slice(0, 30) + '...';
  }
  return text;
}

function displayMovieData(movies) {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  movies.forEach((movie) => {
    const box = document.createElement('div');
    box.classList.add('box');

    const title = document.createElement('h2');
    title.textContent = truncateText(movie.title, 30);


    const poster = document.createElement('img');
    poster.src = IMG_URL + movie.poster_path;
    poster.alt = movie.title;
    poster.style.width = '228px';
    poster.style.height = '303px';

    box.appendChild(poster);
    box.appendChild(title);

    container.appendChild(box);
  });
}

fetchMovieData();
