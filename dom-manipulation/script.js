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
  document.getElementById('addQuoteButton').addEventListener('click', addQuote);
  
  // Event listener for the 'Export Quotes' button
  document.getElementById('exportQuotesButton').addEventListener('click', exportToJsonFile);
  
  // Event listener for the 'Import Quotes' file input
  document.getElementById('importFile').addEventListener('change', importFromJsonFile);
  
  // Show a random quote when the script is loaded
  showRandomQuote();