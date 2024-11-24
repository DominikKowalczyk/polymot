import config from './config.js';

// Function to fetch Google search results
export async function fetchGoogleSearch(query) {
  const { API_KEY, CSE_ID } = config;
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CSE_ID}&q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Return the first 3 organic results
    if (data.items && data.items.length > 0) {
      return data.items.slice(0, 3).map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
      }));
    } else {
      throw new Error('No results found.');
    }
  } catch (error) {
    console.error('Error fetching Google search results:', error.message);
    return null;
  }
}

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'google-search') {
    // Process the search asynchronously
    fetchGoogleSearch(message.query)
      .then((results) => {
        sendResponse(results); // Send the array of results back
      })
      .catch((error) => {
        console.error('Error handling search:', error);
        sendResponse(null); // Respond with null on failure
      });
    return true; // Keep the port open for async response
  }
});
