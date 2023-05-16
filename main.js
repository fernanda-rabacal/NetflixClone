/* const API_KEY = 'api_key=b4b5f9d98442f11bbdd50a5adf70f1d1';
const BASE_URL = 'https://api.themoviedb.org/3/';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const language = 'language=pt-BR'; */

import { API_KEY } from "./api.js";
import { BASE_URL } from "./api.js";
import { IMG_URL } from "./api.js";
import { language } from "./api.js";

let home = document.querySelector("#home")
let popularCarousel = document.querySelector(".popular")
let movieContainer = document.querySelector(".movie")
let searchContainer = document.querySelector(".search-container")
let searchInput = document.querySelector("#search")
/* let random = Math.floor(Math.random() * 60) */
let moviesIds = []
let tvSeriesIds = []

document.addEventListener("mouseup", hideSearch);

async function getMovies(params) {

  try {
    let data = []

    for(let i = 1; i < 4; i++) {
      let response = await fetch(`${BASE_URL}movie/${params}?${API_KEY}&${language}&page=${i}`, {cors: "no-cors"})
      response = await response.json()
      data.push(...response.results) 
      
      response.results.forEach(movie => moviesIds.push(movie.id))
    } 
    
    return data
  } catch (e) {
    throw new Error(e.message)
  }
      
      /* .then(response => response.json())
      .then(data => {  
        data.results.forEach(movie => {
          moviesIds.push(movie.id)
          
      })})
      .catch(e => console.log(e))
    }
 */
}

async function getTvSeries() {

  try {
    let data = []

    for(let i = 1; i < 4; i++) {
      let response = await fetch(`${BASE_URL}tv/popular?${API_KEY}&${language}&page=${i}`, {cors: "no-cors"})
      response = await response.json()
      data.push(...response.results) 
      
      response.results.forEach(tvSerie => tvSeriesIds.push(tvSerie.id))
    } 
    
    return data
  } catch (e) {
    throw new Error(e.message)
  }
}

async function getMovie(id) {
  try {
    let response = await fetch(`${BASE_URL + "movie/" + id + "?" + API_KEY}&${language}`)
    let data = await response.json()

    return data
  } catch (e) {
    throw new Error(e.message)
  }

}

async function getTvSerie(id) {
  try {
    let response = await fetch(`${BASE_URL + "tv/" + id + "?" + API_KEY}&${language}`)
    let data = await response.json()

    return data
  } catch (e) {
    throw new Error(e.message)
  }

}

async function getRandomPoster() {
  let random = Math.floor(Math.random() + 1 * 59)
  let movieOrPoster = Math.floor(Math.random() * 5) > 2
  console.log(movieOrPoster)

  if(movieOrPoster) {
    let movie = await getMovie(moviesIds[random])
  
    home.innerHTML = `
      <div class="poster-infos">
        <h4>Filme</h4>
        <h1>${movie.title}</h1>
        <p>${movie.overview}</p>
      </div>
      <img src=${IMG_URL + movie.backdrop_path} alt="${movie.title} poster"/>
    `
    
    return;
  }
  
  let tvSerie = await getTvSerie(tvSeriesIds[random]) 
  
  home.innerHTML = `
    <div class="poster-infos">
      <h4>Série</h4>
      <h1>${tvSerie.name}</h1>
      <p>${tvSerie.overview}</p>
    </div>
    <img src=${IMG_URL + tvSerie.backdrop_path} alt="${tvSerie.name} poster"/>
  `

}

async function getPopularCarousel() {
  let movies = await getMovies("popular")

  for(let movie of movies) {
    popularCarousel.innerHTML += `<img src=${IMG_URL + movie.poster_path} onclick='getMovie(${movie.id})' />`
  }
}
  
function goLeft() {
  carousel.scrollLeft -= carousel.offsetWidth - 500
}

function goRight() {
  carousel.scrollLeft += carousel.offsetWidth - 500
}

function showSearch() {
  searchContainer.style.border = "1px solid white"
  searchInput.style.width = "25rem"
}

function hideSearch(e) {
    if (!searchContainer.contains(e.target)) {
      searchContainer.style.border = "none"
      searchInput.style.width = "0"
    }
}

async function callFunctions() {
  await getTvSeries()
  await getPopularCarousel()
  await getRandomPoster()

}

callFunctions()