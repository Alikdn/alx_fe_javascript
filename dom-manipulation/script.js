// Array to store quote objects
let quotes = [
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
    addButton.onclick = addQuote;
    formDiv.appendChild(addButton);
  
    document.body.appendChild(formDiv);
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote(); // Optionally show the newly added quote
      alert('New quote added!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  // Event listener for the 'Show New Quote' button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Call the function to create the form when the script is loaded
  createAddQuoteForm();