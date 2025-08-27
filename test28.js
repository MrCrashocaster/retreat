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
      result.push(current);
      current = "";
    } else current += char;
  }
  result.push(current);
  return result;
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

// Filtering logic
function applyFilters() {
  const dateFilter = document.getElementById("dateFilter").value;
  const categoryFilter = document.getElementById("categoryFilter").value.toLowerCase();

  filteredData = peopleData.filter(event => {
    let matchesDate = true;
    let matchesCategory = true;

    if (dateFilter && event.month !== dateFilter) matchesDate = false;
    if (categoryFilter && !event.category.toLowerCase().includes(categoryFilter)) matchesCategory = false;

    return matchesDate && matchesCategory;
  });

  currentPage = 1;
  renderPage(currentPage);
}

// Populate filter options dynamically
function populateFilters() {
  const dateSelect = document.getElementById("dateFilter");
  const categorySelect = document.getElementById("categoryFilter");

  const months = [...new Set(peopleData.map(e => e.month).filter(Boolean))];
  const categories = [...new Set(peopleData.map(e => e.category).filter(Boolean))];

  months.forEach(month => {
    const opt = document.createElement("option");
    opt.value = month;
    opt.textContent = month;
    dateSelect.appendChild(opt);
  });

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });

  dateSelect.addEventListener("change", applyFilters);
  categorySelect.addEventListener("change", applyFilters);
}

// Pagination buttons
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});
document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
    currentPage++;
    renderPage(currentPage);
  }
});

const pagination = document.querySelector('.pagination');
if (pagination) pagination.style.display = 'none';

// Fetch CSV
fetch(csvUrl)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then(csvText => {
    const rows = csvText.replace(/\r\n/g, "\n").split("\n").filter(r => r.trim() !== "");
    if (rows.length <= 1) {
      document.getElementById("cards").innerText = "No data found.";
      return;
    }

    const headers = parseCSVRow(rows[0]);
    const organizationIndex = headers.findIndex(h => h.toLowerCase().includes("organization"));
    const dateIndex = headers.findIndex(h => h.toLowerCase().includes("date"));
    const descriptionIndex = headers.findIndex(h => h.toLowerCase().includes("description revised"));
    const categoryIndex = headers.findIndex(h => h.toLowerCase().includes("category")); // <-- new category column

    for (let i = 1; i < rows.length; i++) {
      const cols = parseCSVRow(rows[i]);
      const organization = cols[organizationIndex]?.trim() || "Unknown";
      const description = cols[descriptionIndex]?.trim() || "No description available";
      const category = categoryIndex !== -1 ? (cols[categoryIndex]?.trim() || "Uncategorized") : "Uncategorized";

      let day = "", month = "";
      if (dateIndex !== -1 && cols[dateIndex]) {
        const dateObj = new Date(cols[dateIndex].trim());
        if (!isNaN(dateObj)) {
          day = dateObj.getDate();
          month = dateObj.toLocaleString("default", { month: "short" });
        }
      }

      const imageUrl = "https://pictures.dealer.com/c/cannonmotorcompanygroup/1234/f768563886014d9f957addbce086beea.PNG";

      peopleData.push({ organization, day, month, description, category, imageUrl });
    }

    filteredData = [...peopleData];
    populateFilters();
    renderPage(currentPage);
    if (pagination) pagination.style.display = 'flex';
  })
  .catch(err => {
    console.error("Error loading CSV:", err);
    document.getElementById("cards").innerText = "Error loading data.";
  });
