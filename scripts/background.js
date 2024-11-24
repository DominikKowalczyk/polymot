import config from './config.js';

// Function to log the config (or extend it if needed)
async function loadConfig() {
  console.log('Config loaded:', config);
  // Additional initialization logic if necessary
}

// Load the config when the extension installs
chrome.runtime.onInstalled.addListener(() => {
  loadConfig();
});
