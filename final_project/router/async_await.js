let books = require("./booksdb.js"); 

function getBooks(callback) {
  setTimeout(() => {  
    callback(null, books);
  }, 100);
}

getBooks((err, data) => {
  if (err) console.error(err);
  else console.log("All books:", data);
});


function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { 
      const book = Object.values(books).find(b => b.isbn === isbn);
      if (book) resolve(book);
      else reject(new Error(`Book with ISBN ${isbn} not found`));
    }, 100);
  });
}

getBookByISBN("9780142437223")
  .then(book => console.log("Book found:", book))
  .catch(err => console.error(err.message));


  async function getBooksByAuthor(author) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(b => b.author === author);
      resolve(booksByAuthor);
    }, 100);
  });
}

(async () => {
  const booksByDante = await getBooksByAuthor("Dante Alighieri");
  console.log("Books by Dante:", booksByDante);
})();

async function getBooksByTitle(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booksByTitle = Object.values(books).filter(b => b.title === title);
      resolve(booksByTitle);
    }, 100);
  });
}

(async () => {
  const booksFound = await getBooksByTitle("The Divine Comedy");
  console.log("Books with title 'The Divine Comedy':", booksFound);
})();
