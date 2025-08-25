const express = require('express');
const books = require("./booksdb.js");

const public_users = express.Router();

public_users.get('/books', (req, res) => {
  function getBooks(callback) {
    setTimeout(() => {
      callback(null, books);
    }, 100);
  }

  getBooks((err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(data);
  });
});

public_users.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = Object.values(books).find(b => b.isbn === isbn);
        if (book) resolve(book);
        else reject(new Error(`Book with ISBN ${isbn} not found`));
      }, 100);
    });
  }

  getBookByISBN(isbn)
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err.message }));
});

public_users.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;

  async function getBooksByAuthor(author) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booksByAuthor = Object.values(books).filter(b => b.author === author);
        resolve(booksByAuthor);
      }, 100);
    });
  }

  const booksByAuthor = await getBooksByAuthor(author);
  res.status(200).json(booksByAuthor);
});

public_users.get('/books/title/:title', async (req, res) => {
  const { title } = req.params;

  async function getBooksByTitle(title) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booksByTitle = Object.values(books).filter(b => b.title === title);
        resolve(booksByTitle);
      }, 100);
    });
  }

  const booksByTitle = await getBooksByTitle(title);
  res.status(200).json(booksByTitle);
});

module.exports = public_users;
