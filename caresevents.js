
  const csvUrl = "https://script.google.com/macros/s/AKfycbzLKGECLy2jFEqJkhfAjITK31XPAsbp8bMDTfHiGEoXLbjzGrYJvPekvgqnyRzKhlTk/exec";

  let peopleData = [];
  let filteredData = [];
  let currentPage = 1;
  const itemsPerPage = 6;

  // Better CSV row parsing
  function parseCSVRow(row) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];

      if (char === '"') {
        // Handle escaped double quotes inside quoted fields
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map(value => value.replace(/^"(.*)"$/, "$1").trim());
  }

  // Render page of events
  function renderPage(page) {
    const container = document.getElementById("cards");
    const pageInfo = document.getElementById("pageInfo");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");

    if (!container) return;

    container.innerHTML = "";

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredData.slice(start, end);

    if (pageItems.length === 0) {
      container.innerHTML = '<p class="no-results">No events match your filter.</p>';

      if (pageInfo) pageInfo.innerText = "Page 0 of 0";
      if (prevPage) prevPage.disabled = true;
      if (nextPage) nextPage.disabled = true;
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

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (pageInfo) pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    if (prevPage) prevPage.disabled = page === 1;
    if (nextPage) nextPage.disabled = page >= totalPages;
  }

  // Filtering logic
  function applyFilters() {
    const dateFilterEl = document.getElementById("dateFilter");
    const categoryFilterEl = document.getElementById("categoryFilter");

    const dateFilter = dateFilterEl ? dateFilterEl.value : "";
    const categoryFilter = categoryFilterEl ? categoryFilterEl.value.toLowerCase() : "";

    filteredData = peopleData.filter(event => {
      let matchesDate = true;
      let matchesCategory = true;

      if (dateFilter && event.month !== dateFilter) {
        matchesDate = false;
      }

      if (
        categoryFilter &&
        !(event.category || "").toLowerCase().includes(categoryFilter)
      ) {
        matchesCategory = false;
      }

      return matchesDate && matchesCategory;
    });

    currentPage = 1;
    renderPage(currentPage);
  }

  // Populate filter options dynamically
  function populateFilters() {
    const dateSelect = document.getElementById("dateFilter");
    const categorySelect = document.getElementById("categoryFilter");

    if (!dateSelect || !categorySelect) return;

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
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
      }
    });
  }

  const pagination = document.querySelector(".pagination");
  if (pagination) pagination.style.display = "none";

  // Fetch CSV
  fetch(csvUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    })
    .then(csvText => {
      const cardsContainer = document.getElementById("cards");

      const rows = csvText
        .replace(/\r\n/g, "\n")
        .split("\n")
        .filter(r => r.trim() !== "");

      if (rows.length <= 1) {
        if (cardsContainer) cardsContainer.innerText = "No data found.";
        return;
      }

      const headers = parseCSVRow(rows[0]).map(h => h.toLowerCase().trim());

      const organizationIndex = headers.findIndex(h => h.includes("organization"));
      const dateIndex = headers.findIndex(h => h.includes("date"));
      const descriptionIndex = headers.findIndex(h => h.includes("description revised"));
      const categoryIndex = headers.findIndex(h => h.includes("category"));

      if (organizationIndex === -1) {
        throw new Error("Could not find an organization column in the CSV.");
      }

      peopleData = [];

      for (let i = 1; i < rows.length; i++) {
        const cols = parseCSVRow(rows[i]);

        // Skip rows that are effectively empty
        if (!cols.some(col => (col || "").trim() !== "")) {
          continue;
        }

        const organization = (cols[organizationIndex] || "").trim();
        const description =
          descriptionIndex !== -1
            ? ((cols[descriptionIndex] || "").trim() || "No description available")
            : "No description available";

        const category =
          categoryIndex !== -1
            ? ((cols[categoryIndex] || "").trim() || "Uncategorized")
            : "Uncategorized";

        // THIS is what prevents the "Unknown" card
        if (!organization) {
          console.log("Skipped blank organization row:", rows[i], cols);
          continue;
        }

        let day = "";
        let month = "";

        if (dateIndex !== -1 && cols[dateIndex]) {
          const rawDate = cols[dateIndex].trim();
          const dateObj = new Date(rawDate);

          if (!isNaN(dateObj.getTime())) {
            day = dateObj.getDate();
            month = dateObj.toLocaleString("default", { month: "short" });
          }
        }

        const imageUrl =
          "https://pictures.dealer.com/c/cannonmotorcompanygroup/1234/f768563886014d9f957addbce086beea.PNG";

        peopleData.push({
          organization,
          day,
          month,
          description,
          category,
          imageUrl
        });
      }

      filteredData = [...peopleData];
      populateFilters();
      renderPage(currentPage);

      if (pagination && filteredData.length > 0) {
        pagination.style.display = "flex";
      }
    })
    .catch(err => {
      console.error("Error loading CSV:", err);
      const cardsContainer = document.getElementById("cards");
      if (cardsContainer) cardsContainer.innerText = "Error loading data.";
    });
