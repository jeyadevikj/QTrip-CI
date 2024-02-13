import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  cities.forEach((key) => {
    addCityToDOM(key.id, key.city, key.description, key.image);
  });
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  const url = config.backendEndpoint + "/cities";
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {

  const divElement = document.getElementById("data");

  const card = document.createElement("div");
  card.setAttribute("class","col-6 col-lg-3 mb-3")

  const link = document.createElement("a");
  link.href = `pages/adventures/?city=${id}`;
  link.id = id;

  const tile = document.createElement("div");
  tile.classList.add("tile");

  const imgElement = document.createElement("img");
  imgElement.src = image;
  imgElement.alt = id;

  const tileTextContainer = document.createElement("div");
  tileTextContainer.classList.add("tile-text")
  tileTextContainer.innerHTML = `
  <h5>${city}</h5>
  <p>${description}</p>
  `;


  tile.append(imgElement);
  tile.append(tileTextContainer);
  link.append(tile);
  card.append(link);
  divElement.append(card);
}

  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM

export { init, fetchCities, addCityToDOM };
