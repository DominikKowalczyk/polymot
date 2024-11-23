// JavaScript to handle Google search
document.getElementById("google-search-form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent form from reloading the page
    const query = document.getElementById("google-search-input").value;
    const resultDiv = document.getElementById("google-search-result");

    if (!query.trim()) {
      resultDiv.textContent = "Please enter a search term.";
      return;
    }

    // Encode the query for safe URL usage
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    try {
      // Fetch the search results page
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "text/html",
        },
      });
      const htmlText = await response.text();

      // Parse the HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      // Find the first organic result using Google DOM structure
      const firstResult = doc.querySelector("a h3");
      if (firstResult) {
        resultDiv.innerHTML = `
          <a href="${firstResult.parentElement.href}" target="_blank">${firstResult.textContent}</a>
        `;
      } else {
        resultDiv.textContent = "No results found.";
      }
    } catch (error) {
      console.error("Error fetching Google search results:", error);
      resultDiv.textContent = "An error occurred. Please try again.";
    }
  });