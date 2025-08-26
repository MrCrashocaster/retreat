const csvUrl = "https://script.google.com/macros/s/AKfycbzLKGECLy2jFEqJkhfAjITK31XPAsbp8bMDTfHiGEoXLbjzGrYJvPekvgqnyRzKhlTk/exec"; // Replace with your CSV link

// This array will store all fetched data
let peopleData = [];

// 🔑 Your Unsplash access key
const accessKey = "OONNkNWpgoFulLF3g0S9TGcRcgySZJKfiEnfnrOjBsU"; 

// Function to fetch Unsplash random image
async function getRandomImage(query) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.urls?.regular || "https://via.placeholder.com/300x200?text=No+Image";
}

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

      const query = queries[i % queries.length];

      let imageUrl;
      try {
        imageUrl = await getRandomImage(query);
      } catch (e) {
        console.warn(`Image fetch failed for row ${i}, using placeholder.`);
        imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
      }

      peopleData.push({ organization, category, imageUrl });

      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
        <div class="event-card">
        <div class="image-container">
        <img src="${imageUrl}" alt="${organization}" class="event-image dynamic-resize">
        <div class="date-label">
        <span class="date-day"></span>
        <span class="date-month"></span>
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
