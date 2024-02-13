import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const queryParams = new URLSearchParams(search);
  const adventureId = queryParams.get("adventure");
  return adventureId;
  // Place holder for functionality to work in the Stubs
  // return null;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  const url =
    config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`;
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
  // Place holder for functionality to work in the Stubs
  // return null;
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  const name = document.getElementById("adventure-name");
  name.textContent = adventure.name;

  const subtitle = document.getElementById("adventure-subtitle");
  subtitle.textContent = adventure.subtitle;

  const photos = document.getElementById("photo-gallery");
  adventure.images.forEach((image) => {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = image;
    img.classList.add("activity-card-image");
    div.append(img);
    photos.append(div);
  });

  const content = document.getElementById("adventure-content");
  content.innerText = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the bootstrap carousel to show the Adventure images
  const photos = document.getElementById("photo-gallery");
  let items = "";
  let indicators = "";
  images.forEach((image, i) => {
    indicators += `
      <button
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide-to="${i}"
        ${
          i === 0
            ? 'class="active" aria-current="true" aria-label="Slide 1"'
            : `aria-label="Slide ${i + 1}"`
        }
      ></button>
    `;
    items += `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${image}" class="d-block activity-card-image" alt="Activity Card Image">
      </div>
    `;
  });

  photos.innerHTML = `  
    <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        ${indicators}
      </div>
      <div class="carousel-inner">
        ${items}
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  const reservationPanel = document.getElementById(
    "reservation-panel-available"
  );
  const soldOutPanel = document.getElementById("reservation-panel-sold-out");
  if (adventure.available) {
    soldOutPanel.style.display = "none";
    reservationPanel.style.display = "block";
    document.getElementById("reservation-person-cost").textContent =
      adventure.costPerHead;
  } else {
    soldOutPanel.style.display = "block";
    reservationPanel.style.display = "none";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  document.getElementById("reservation-cost").textContent =
    adventure.costPerHead * persons;
}

//Implementation of reservation form submission
function captureFormSubmit(currentAdventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  
  const form = document.getElementById("myForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();


    const name = form.elements["name"].value;
    const date = form.elements["date"].value;
    const person = form.elements["person"].value;
    const adventure = currentAdventure.id;

    const data = { name, date, person, adventure };
    const jsonData = JSON.stringify(data);

    const url = config.backendEndpoint + "/reservations/new";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      if (response.ok) {
        alert("Success!");
        location.reload();
      } else {
        alert("Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed!");
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  const reservedBanner=document.getElementById("reserved-banner")

  if (adventure.reserved) {
    reservedBanner.style.display = "block";
  }else{
    reservedBanner.style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
