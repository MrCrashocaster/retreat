const csvUrl = "https://script.google.com/macros/s/AKfycbzLKGECLy2jFEqJkhfAjITK31XPAsbp8bMDTfHiGEoXLbjzGrYJvPekvgqnyRzKhlTk/exec"; // Replace with your CSV link

// This array will store all fetched data
let peopleData = [];

fetch(csvUrl)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then(async csvText => {
    const rows = csvText.replace(/\r\n/g, "\n").split("\n").filter(r => r.trim() !== "");
    if (rows.length <= 1) {
      document.getElementById("cards").innerText = "No data found.";
      return;
    }

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

    const headers = parseCSVRow(rows[0]);
    console.log("CSV headers:", headers);

    const organizationIndex = headers.findIndex(h => h.toLowerCase().includes("organization"));
    const categoryIndex = headers.findIndex(h => h.toLowerCase().includes("category"));
    const dateIndex = headers.findIndex(h => h.toLowerCase().includes("date"));

    const container = document.getElementById("cards");
    container.innerHTML = "";

    const queries = ["charity", "community", "volunteer", "people helping", "giving back"];
    let peopleData = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;

      const cols = parseCSVRow(row);
      const organization = cols[organizationIndex]?.trim() || "Unknown";
      const category = cols[categoryIndex]?.trim() || "N/A";

      let day = "";
      let month = "";
      if (dateIndex !== -1 && cols[dateIndex]) {
        try {
          const dateObj = new Date(cols[dateIndex].trim());
          if (!isNaN(dateObj)) {
            day = dateObj.getDate(); // 1–31
            month = dateObj.toLocaleString("default", { month: "short" }); // e.g. Jan, Feb
          }
        } catch (err) {
          console.warn("Invalid date:", cols[dateIndex]);
        }
      }
      
      const query = queries[i % queries.length];

      let imageUrl;
      try {
        imageUrl = "https://pictures.dealer.com/c/cannonmotorcompanygroup/1234/f768563886014d9f957addbce086beea.PNG";
      } catch (e) {
        console.warn(`Image fetch failed for row ${i}, using placeholder.`);
        imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
      }

      peopleData.push({ organization, category, day, month, imageUrl });

      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
        <div class="event-card">
        <div class="image-container">
        <img src="${imageUrl}" alt="${organization}" class="event-image dynamic-resize">
        <div class="date-label">
        <span class="date-day">${day || ""}</span>
        <span class="date-month">${month || ""}</span>
        </div>
        </div>
        <div class="card-content">
        <h3 class="event-title">${organization}</h3>
        <p class="event-description"></p>
        </div>
        </div>
      `;
      container.appendChild(card);
    }

    console.log("People data array:", peopleData);
  })
  .catch(err => {
    console.error("Error loading CSV:", err);
    document.getElementById("cards").innerText = "Error loading data.";
  });
