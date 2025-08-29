const csvUrl = "https://script.google.com/macros/s/AKfycbzLKGECLy2jFEqJkhfAjITK31XPAsbp8bMDTfHiGEoXLbjzGrYJvPekvgqnyRzKhlTk/exec"; 

let peopleData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 6;

// CSV parsing
function parseCSVRow(row) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else current += char;
  }
  result.push(current.trim());
  return result;
}

// Convert array row into event object
function rowToEvent(row) {
  return {
    imageUrl: row[0] || "",
    organization: row[1] || "",
    description: row[2] || "",
    day: row[3] || "",
    month: row[4] || ""
  };
}

// Render page of events
function renderPage(page) {
  const container = document.getElementById("cards");
  container.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredData.slice(start, end);

  if (pageItems.length === 0) {
    container.innerText = "No events match your filter.";
    return;
  }

  pageItems.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.innerHTML = `
      <div class="image-container">
        <img src="${event.imageUrl}" alt="${event.organization}" class="event-image">
        <div class="date-label">
          <span class="date-day">${event.day || ""}</span>
          <span class="date-month">${event.month || ""}</span>
        </div>
      </div>
      <div class="card-content">
        <h3 class="event-title">${event.organization}</h3>
        <p class="event-description">${event.description}</p>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${Math.ceil(filteredData.length / itemsPerPage)}`;
  document.getElementById("prevPage").disabled = page === 1;
  document.getElementById("nextPage").disabled = page >= Math.ceil(filteredData.length / itemsPerPage);
}

// Fetch and load data
fetch(csvUrl)
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split("\n").map(parseCSVRow);
    // skip header row if your CSV has one
    peopleData = rows.slice(1).map(rowToEvent);
    filteredData = peopleData;
    renderPage(currentPage);
  })
  .catch(err => {
    document.getElementById("cards").innerText = "Error loading events.";
    console.error("CSV fetch error:", err);
  });
