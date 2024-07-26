// Array to store quote objects
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" },
  { text: "You have to dream before your dreams can come true.", category: "Dreams" }
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"$
  {randomQuote.text}" - $
  {randomQuote.category}`;
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const inputText = document.createElement('input');
  inputText.id = 'newQuoteText';
  inputText.type = 'text';
  inputText.placeholder = 'Enter a new quote';
  formDiv.appendChild(inputText);

  const inputCategory = document.createElement('input');
  inputCategory.id = 'newQuoteCategory';
  inputCategory.type = 'text';
  inputCategory.placeholder = 'Enter quote category';
  formDiv.appendChild(inputCategory);

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteButton';
  addButton.textContent = 'Add Quote';
  formDiv.appendChild(addButton);

  const exportButton = document.createElement('button');
  exportButton.id = 'exportQuotesButton';
  exportButton.textContent = 'Export Quotes';
  formDiv.appendChild(exportButton);

  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'importFile';
  importInput.accept = '.json';
  formDiv.appendChild(importInput);

  document.getElementById('quoteFormContainer').appendChild(formDiv);
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote(); // Optionally show the newly added quote
      alert('New quote added!');
  } else {
      alert('Please enter both quote text and category.');
  }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for the 'Show New Quote' button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the 'Add Quote' button
document.getElementById('quoteFormContainer').addEventListener('click', function(event) {
  if (event.target.id === 'addQuoteButton') {
      addQuote();
  } else if (event.target.id === 'exportQuotesButton') {
      exportToJsonFile();
  }
});

// Event listener for the 'Import Quotes' file input
document.getElementById('quoteFormContainer').addEventListener('change', function(event) {
  if (event.target.id === 'importFile') {
      importFromJsonFile(event);
  }
});

// Call the function to create the form when the script is loaded
createAddQuoteForm();

// Show a random quote when the script is loaded
showRandomQuote();

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const serverQuotes = await response.json();
      return serverQuotes.map(quote => ({
          text: quote.body,
          category: "Server" // Assuming server quotes have a default category
      }));
  } catch (error) {
      console.error('Error fetching quotes from server:', error);
      return [];
  }
}

// Function to post quotes to the server
async function postQuotesToServer(newQuotes) {
  try {
      for (const quote of newQuotes) {
          await fetch('https://jsonplaceholder.typicode.com/posts', {
              method: 'POST',
              body: JSON.stringify(quote),
              headers: {
                  'Content-Type': 'application/json; charset=UTF-8',
              },
          });
      }
  } catch (error) {
      console.error('Error posting quotes to server:', error);
  }
}

// Function to sync quotes with the server and handle conflicts
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
  
  const mergedQuotes = mergeQuotes(localQuotes, serverQuotes);
  quotes = mergedQuotes;
  localStorage.setItem('quotes', JSON.stringify(quotes)); // Update local storage with merged quotes
  saveQuotes();
  populateCategories();
  filterQuotes();
  
  // Post any new quotes to the server
  const newQuotes = localQuotes.filter(localQuote => !serverQuotes.find(serverQuote => serverQuote.text === localQuote.text));
  await postQuotesToServer(newQuotes);
  
  alert('Quotes synced with server!'); // Notify user after syncing
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
setInterval(async () => {
  await syncQuotes();
}, 30000);

// Initial sync when the script is loaded
syncQuotes();