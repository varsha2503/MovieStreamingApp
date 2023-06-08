let currentPage = 1 ;               // variables to maintain scrolling and to check search is performed or not and to check up and down scroll
let searchPerformed = false;
let previousScrollTop = 0;

// function to maintain site when side bar is closed or open
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const container = document.querySelector('.container');

  sidebar.classList.toggle('active');
  container.style.width = sidebar.classList.contains('active') ? 'auto' : '100%';
  container.style.marginLeft = sidebar.classList.contains('active') ? '0' : '-280px';    // to close side bar

  // when the side bar is open then the movie container properties
  if (sidebar.classList.contains('active')) {
    container.style.marginLeft = '340px';
    container.style.marginRight = '40px';
    container.style.marginTop = '50px';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 300px))';    // to make website responsive
    container.style.gridRowGap = '90px';
    container.style.gridColumnGap = '60px';
    container.style.transition = 'transform 0.3s ease-in-out';
  } else {                // when the side bar is closed then the container properties
    container.style.marginLeft = '60px';
    container.style.width = '95%';
    container.style.marginTop = '50px0';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 300px))';   // to make website responsive 
    container.style.gridRowGap = '80px';
    container.style.gridColumnGap = '50px';
    container.style.transition = 'transform 0.3s ease-in-out';
  }
}

// constants to fetch api
const API_KEY = 'api_key=7c69bc4fa25a0ddf37153adac20be8ff';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// function to get movie data from the api data like title of movie and movie poster 
async function fetchMovieData() {
  try {
    const response = await fetch(`${API_URL}&page=${currentPage}`);
    const data = await response.json();
    displayMovieData(data.results);
  } catch (error) {
    console.error('Error fetching movie data:', error);
  }
}

// function show that if the length of the movie title is very large only some portion of the title will be shown 
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

// function to display movies as 1st movie poster and then movie title
function displayMovieData(movies) {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  movies.forEach((movie) => {             // do this for every movie in api 
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

// calling fetch movie data to get the data on screen
fetchMovieData();

// function to load more movies when the end of website is reached
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // to check if the scroll position has increased
  if (scrollTop > previousScrollTop) {
    // to check if a search has been performed and remove the poster
    if (searchPerformed) {
      const poster = document.getElementById('poster');
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        poster.innerHTML = ''; // Remove the poster
        currentPage++;
        fetchMovieData();
      }
    } else {
      // Continue with infinite scrolling if no search has been performed
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
        fetchMovieData();
      }
    }
  }

  previousScrollTop = scrollTop; // Update the previous scroll position
}

// function to get searched movie
const getPoster = function() {
  const film = document.getElementById('sear').value ;
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=7c69bc4fa25a0ddf37153adac20be8ff&query=${film}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length > 0) {
          const title = data.results[0].title;
          const posterPath = data.results[0].poster_path;
          const img = document.createElement('img');                 // to get the movie poster we used img
          searchPerformed = true ;
          img.src = `http://image.tmdb.org/t/p/w500/${posterPath}`;
          poster.innerHTML = `<p>Your search found: <strong>${title}</strong></p>`;
          poster.appendChild(img);                                  // to get the movie poster 
          img.style.height = '500px' ;
          img.style.marginLeft = '600px' ;
        }
      })
      .catch(error => {
        console.error('Error fetching movie data:', error);
      });

  return false;
};

// suc is id for seach button and sear is id for search input text bar
document.getElementById('suc').addEventListener('click', getPoster);
document.getElementById('sear').addEventListener('keyup', function(event) {
  if (event === 13) {
    getPoster();
  }
});

window.addEventListener('scroll', handleScroll);
