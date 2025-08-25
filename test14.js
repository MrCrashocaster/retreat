const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTM-jBqSXMTCgJtjiQdnHghrw67uWk9nHE6Gx31Vb4ckHH0Af7Ngq1W151_ktBKdqQhHfDXvu2s_iY0/pub?gid=2019232756&single=true&output=csv"; // Replace with your CSV link

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
  .then(res => res.text())
  .then(async csvText => {
    const rows = csvText.replace(/\r\n/g, "\n").split("\n").filter(r => r.trim() !== "");
    if (rows.length <= 1) {
      document.getElementById("cards").innerText = "No data found.";
      return;
    }

    // Simple CSV parser
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
    const organizationIndex = headers.findIndex(h => h.toLowerCase() === "organization");
    const categoryIndex = headers.findIndex(h => h.toLowerCase() === "category");

    // Clear container
    const container = document.getElementById("cards");
    container.innerHTML = "";

    // Keywords for Unsplash search
    const queries = ["charity", "community", "volunteer", "people helping", "giving back"];

    // Create card for each row
    for (let i = 1; i < rows.length; i++) {
  const row = rows[i].trim();
  if (!row) continue; // skip empty lines

  const cols = parseCSVRow(row);
  const organization = cols[organizationIndex] ? cols[organizationIndex].trim() : "Unknown";
  const category = cols[categoryIndex] ? cols[categoryIndex].trim() : "N/A";

  // Pick a query keyword for this card
  const query = queries[i % queries.length];

  // Wait for Unsplash image
  let imageUrl;
  try {
    imageUrl = await getRandomImage(query);
  } catch (e) {
    console.warn(`Image fetch failed for row ${i}, using placeholder.`);
    imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
  }

  // Save to variable array
  peopleData.push({ name, age, imageUrl });

  // Build HTML card
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${imageUrl}" alt="${organization}">
    <h2>${organization}</h2>
    <p>Age: ${category}</p>
  `;
  container.appendChild(card);
}


    console.log("People data array:", peopleData); // Now you can use this array elsewhere
  })
  .catch(err => {
    console.error("Error loading CSV:", err);
    document.getElementById("cards").innerText = "Error loading data.";
  });
