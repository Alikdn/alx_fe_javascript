// Function to populate category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset filter options
  const categories = [...new Set(quotes.map(quote => quote.category))]; // Extract unique categories
  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const quoteDisplay = document.getElementById('quoteDisplay');
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `"$
  {randomQuote.text}" - $
  {randomQuote.category}`;
}

// Save last selected category filter to local storage
document.getElementById('categoryFilter').addEventListener('change', () => {
  localStorage.setItem('lastSelectedCategory', document.getElementById('categoryFilter').value);
});

// Restore last selected category filter from local storage
document.addEventListener('DOMContentLoaded', () => {
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  document.getElementById('categoryFilter').value = lastSelectedCategory;
  filterQuotes();
});

// Call the function to populate the categories when the script is loaded
populateCategories();
// Server simulation URL
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Function to sync local quotes with the server
async function syncWithServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();

        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        const updatedQuotes = mergeQuotes(localQuotes, serverQuotes);

        quotes = updatedQuotes;
        saveQuotes();
        populateCategories();
        filterQuotes();
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

// Function to merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
    const mergedQuotes = [...localQuotes];

    serverQuotes.forEach(serverQuote => {
        if (!localQuotes.find(localQuote => localQuote.text === serverQuote.text)) {
            mergedQuotes.push(serverQuote);
        }
    });

    return mergedQuotes;
}

// Periodically sync with the server every 30 seconds
setInterval(syncWithServer, 30000);

// Call syncWithServer when the script is loaded
syncWithServer();