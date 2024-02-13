import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them
  const url = config.backendEndpoint + "/reservations/";
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

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table
  //Conditionally render the no-reservation-banner and reservation-table-parent
  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

  const noReservationBanner = document.getElementById("no-reservation-banner");
  const reservationTable = document.getElementById("reservation-table-parent");
  if (reservations.length) {
    noReservationBanner.style.display = "none";
    reservationTable.style.display = "block";
    let tableBody = document.getElementById("reservation-table");
    const elements = [];
    reservations.forEach((reservation) => {
      let tableRow = document.createElement("tr");
      tableRow.innerHTML = `
      <td><strong>${reservation.id}</strong></td>
       <td>${reservation.name}</td>
       <td>${reservation.adventureName}</td>
       <td>${reservation.person}</td>
       <td>${new Date(reservation.date).toLocaleDateString("en-IN", {
         day: "numeric",
         month: "numeric",
         year: "numeric",
       })}</td>
       <td>${reservation.price}</td>
       <td>${new Date(reservation.time)
         .toLocaleString("en-IN", {
           year: "numeric",
           month: "long",
           day: "numeric",
           hour: "numeric",
           minute: "numeric",
           second: "numeric",
           hour12: true,
         })
         .replace(" at", ",")}</td>
       <td id="${reservation.id}"><a href="/frontend/pages/adventures/detail/?adventure=${
         reservation.adventure
       }" class="reservation-visit-button" id="${
        reservation.adventure
      }">Visit Adventure</a></td>
      `;

      elements.push(tableRow);
    });

    tableBody.append(...elements);
  } else {
    noReservationBanner.style.display = "block";
    reservationTable.style.display = "none";
  }
}

export { fetchReservations, addReservationToTable };
