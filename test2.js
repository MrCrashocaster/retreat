const sheetUrl = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv";

    async function fetchData() {
      const response = await fetch(sheetUrl);
      const text = await response.text();
      const rows = text.trim().split("\n").map(r => r.split(","));

      const container = document.getElementById("cards");
      container.innerHTML = "";

      // Skip the header row
      for (let i = 1; i < rows.length; i++) {
        const [name, age] = rows[i];

        // Use Unsplash with charity theme
        const imageUrl = `https://source.unsplash.com/220x140/?charity,volunteer,help&sig=${i}`;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${imageUrl}" alt="${name}">
          <h2>${name}</h2>
          <p>Age: ${age}</p>
        `;
        container.appendChild(card);
      }
    }

    fetchData();
