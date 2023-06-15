let currentPage = 1;               // variables to maintain scrolling and to check search is performed or not 
let searchPerformed = false;

// function to maintain site when side bar is closed or open
const toggleSidebar = () => {
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
    container.style.marginLeft = '90px';
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
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

// function to display movies as 1st movie poster and then movie title
const displayMovieData = (movies) => {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  movies.forEach((movie) => {             // do this for every movie in api 
    const box = document.createElement('div');            // to move movie data to box of container
    box.classList.add('box');

    const title = document.createElement('h2');          // for title 
    title.textContent = truncateText(movie.title, 30);   // to make title shoter


    const poster = document.createElement('img');        // movie poster size and fetching
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

// function to remove searched results when next or previous button is pressed and it also handdles when page is scrolled when something is searched 
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // to check if the scroll position has increased
  if (scrollTop > previousScrollTop) {
    // to check if a search has been performed and remove the poster
    if (searchPerformed) {
        poster.innerHTML = '';           // remove the poster
        currentPage++;
    } else {
      // continue to get more movies on scrolling if no search has been performed
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        currentPage++;
      }
    }
  }
}


// function to get searched movie
const getPoster = function () {
  const film = document.getElementById('sear').value;
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=7c69bc4fa25a0ddf37153adac20be8ff&query=${film}`)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const poster = document.getElementById('poster');
        poster.innerHTML = '';                    // to clear previous results searched to get new one

        const container = document.createElement('div');
        container.className = 'container';
        container.style.marginBottom = '100px';

        for (let i = 0; i < data.results.length; i++) {              // loop to fetch all search results related 
          const title = data.results[i].title;
          const posterPath = data.results[i].poster_path;

          const box = document.createElement('div');
          box.className = 'box';

          const img = document.createElement('img');                 // image to fetch movie poster
          img.src = `http://image.tmdb.org/t/p/w500/${posterPath}`;
          img.style.height = '280px';

          const titleElement = document.createElement('p');          // for title and its properties
          titleElement.innerHTML = `<strong>${title}</strong>`;
          titleElement.textContent = truncateText(title, 25);        // for long title making it sort 

          box.appendChild(img);                        // puts title and movie poster in box 
          box.appendChild(titleElement);
          container.appendChild(box);

        }

        poster.appendChild(container);                  // puts the images in container in boxes
        searchPerformed = true;                         // make searchPerformed true so that it will be removed when moved to end of website

        const message = document.createElement('p');          // to add text after the search results are over and its properties
        message.textContent = 'End of search results.';
        message.style.marginBottom = '100px';
        message.style.background = 'linear-gradient(to bottom right, aqua 0%, blueviolet 50%, blueviolet 50%, plum 100%)';
        message.style.borderTop = '5px solid black ';
        message.style.borderBottom = '5px solid black ';
        message.style.padding = '10px';
        poster.appendChild(message);

      }
    })
    .catch(error => {                          // error when something goes wrong while fetching api for searching 
      console.error('Error fetching movie data:', error);
    });

  return false;
};

// suc is id of search button 
// sear is id of search input text bar  
document.getElementById('suc').addEventListener('click', getPoster);
document.getElementById('sear').addEventListener('keyup', function (event) {
  if (event === 13) {
    getPoster();
  }
});

window.addEventListener('scroll', handleScroll);   // calling handleScroll funaction when scolling is done

// function to change background on clicking the button change backdrop 
document.getElementById('reloadButton').addEventListener('click', function () {
  location.reload();
});


// function to fetch more movies when next button is clicked
const goToNextPage = () => {
  currentPage++;
  if (searchPerformed) {
    const poster = document.getElementById('poster');
    poster.innerHTML = ''; // remove the search results
  }
  fetchMovieData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const nextButton = document.getElementById('nextButton'); 
nextButton.addEventListener('click', goToNextPage);


// function to get to previous movies when previous button is clicked
const goToPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    if (searchPerformed) {
      const poster = document.getElementById('poster');
      poster.innerHTML = ''; // remove the search results
    }
    fetchMovieData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const prevButton = document.getElementById('prevButton');
prevButton.addEventListener('click', goToPreviousPage);

