// DOM Elements
const searchForm = document.getElementById('google-search-form');
const searchInput = document.getElementById('google-search-input');
const searchResultContainer = document.getElementById('google-search-result');

// Handle form submission
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form behavior

  const query = searchInput.value.trim();
  if (!query) return;

  // Clear previous results
  searchResultContainer.innerHTML = 'Searching...';

  // Send message to the background script
  chrome.runtime.sendMessage({ type: 'google-search', query }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      searchResultContainer.innerHTML = 'Error fetching results.';
      return;
    }

    if (response && response.length > 0) {
      // Display results
      searchResultContainer.innerHTML = ''; // Clear the "Searching..." message
      response.forEach((result) => {
        const { title, link, snippet } = result;

        const resultElement = document.createElement('div');
        resultElement.className = 'search-result';

        resultElement.innerHTML = `
          <a href="${link}" target="_blank" class="result-title"><strong>${title}</strong></a>
          <p class="result-snippet">${snippet}</p>
        `;

        searchResultContainer.appendChild(resultElement);
      });
    } else {
      searchResultContainer.innerHTML = 'No results found.';
    }
  });
});
