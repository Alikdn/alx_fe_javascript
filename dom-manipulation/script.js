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
                  'Content-type': 'application/json; charset=UTF-8',
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
  saveQuotes();
  populateCategories();
  filterQuotes();
  
  // Post any new quotes to the server
  const newQuotes = localQuotes.filter(localQuote => !serverQuotes.find(serverQuote => serverQuote.text === localQuote.text));
  await postQuotesToServer(newQuotes);
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

// Function to notify user of data update or conflict resolution
function notifyUser(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'lightblue';
  notification.style.padding = '10px';
  notification.style.border = '1px solid black';
  document.body.appendChild(notification);
  
  setTimeout(() => {
      document.body.removeChild(notification);
  }, 3000);
}

// Periodically sync with the server every 30 seconds
setInterval(async () => {
  await syncQuotes();
  notifyUser('Quotes have been synced with the server.');
}, 30000);

// Initial sync when the script is loaded
syncQuotes();