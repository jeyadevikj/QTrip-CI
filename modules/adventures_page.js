import config from "../conf/index.js";
let cacheData = ""

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  // 1. Get the query parameter string from the search parameter
  const queryParams = new URLSearchParams(search);
  const cityId = queryParams.get("city");
  return cityId;
}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  const url = config.backendEndpoint + `/adventures?city=${city}`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    cacheData = data;
    return data;
  } catch (error) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  const divElement = document.getElementById("data");
  divElement.innerHTML = "";
  const elements = [];

  adventures.forEach((place) => {
    const link = document.createElement("a");
    link.href = `detail/?adventure=${place.id}`;
    link.id = place.id;

    const adventureCard = document.createElement("div");
    adventureCard.classList.add("activity-card");

    const categoryBanner = document.createElement("h6");
    categoryBanner.classList.add("category-banner");
    categoryBanner.innerText = place.category;

    const img = document.createElement("img");
    img.src = place.image;
    img.alt = place.name;

    // const price = place.costPerHead;
    // const currency = place.currency;
    // const cost = new Intl.NumberFormat("en-IN", {
    //   style: "currency",
    //   currency: currency,
    // }).format(price);

    const adventureCardTextContainer = document.createElement("div");
    adventureCardTextContainer.setAttribute("class", "w-100 px-3 pt-1");
    adventureCardTextContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-baseline">
        <h6>${place.name}</h6>
        <p>₹${place.costPerHead}</p>
      </div>
      <div class="d-flex justify-content-between">
        <p>Duration</p>
        <p>${place.duration}</p>
      </div>
    `;

    adventureCard.append(categoryBanner);
    adventureCard.append(img);
    adventureCard.append(adventureCardTextContainer);
    link.append(adventureCard);

    const card = document.createElement("div");
    card.setAttribute("class", "col-6 col-lg-3 mb-3");
    card.append(link);

    elements.push(card);
  });

  divElement.append(...elements);
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  return list.filter(
    (adventure) => adventure.duration >= low && adventure.duration <= high
  );
}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  return list.filter((adventure) => categoryList.includes(adventure.category));
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods

  // Place holder for functionality to work in the Stubs
  let filteredAdventures = list;

  if (filters.duration) {
    let duration_range = filters.duration.split("-");
    filteredAdventures = filterByDuration(
      filteredAdventures,
      duration_range[0],
      duration_range[1]
    );
  }

  if (filters.category.length) {
    filteredAdventures = filterByCategory(filteredAdventures, filters.category);
  }
  return filteredAdventures;
}

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem("filters", JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  const filters = localStorage.getItem("filters");
  let data = JSON.parse(filters);
  return data;
  // Place holder for functionality to work in the Stubs
  // return null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  const categoryList = document.getElementById("category-list");
  const elements = [];

  if (filters.duration) {
    document.getElementById("duration-select").value = filters.duration;
  }

  if (filters.category.length) {
    filters.category.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.setAttribute("class", "category-filter d-flex align-items-baseline");
      const categoryText = document.createElement("span");
      categoryText.innerText = category;
      categoryDiv.append(categoryText);

      const closeButton = document.createElement("button");
      closeButton.setAttribute("class", "category-filter-close btn p-1");
      closeButton.innerHTML = `<i class="bi bi-x-circle"></i>`;
      closeButton.addEventListener("click", () => {
        const index = filters.category.indexOf(category);
        if (index !== -1) {
          filters.category.splice(index, 1);
          document.getElementById("data").textContent = "";
          document.getElementById("category-list").textContent = "";
          generateFilterPillsAndUpdateDOM(filters);
          let filteredAdventures = filterFunction(cacheData, filters);
          addAdventureToDOM(filteredAdventures);
          saveFiltersToLocalStorage(filters);
        }
      });
      categoryDiv.append(closeButton);

      elements.push(categoryDiv);
    });
  }

  categoryList.innerHTML = "";
  categoryList.append(...elements);
}

// Creates a new adventures for the particular city

async function addNewAdventures(city) {
  const url = config.backendEndpoint + "/adventures/new";
  const dataToSend = { city: city };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const data = await response.json();
    location.reload();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  addNewAdventures,
};
