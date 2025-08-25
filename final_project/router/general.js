const express = require('express');
let books = require("./booksdb.js"); 
const jwt = require('jsonwebtoken'); 
let { isValid, users, authenticatedUser} = require("./auth_users.js");
const public_users = express.Router();


// -------------------- REGISTER --------------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// -------------------- LOGIN --------------------
public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid username" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful", token });
});


// -------------------- GET ALL BOOKS --------------------
public_users.get('/books', (req, res) => {
  return res.status(200).json(books); // return whole object
});


// -------------------- GET BOOK BY ISBN --------------------
public_users.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  return res.status(200).json(book);
});



// -------------------- GET BOOKS BY AUTHOR --------------------
public_users.get('/books/author/:author', (req, res) => {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: `No books found by author ${author}.` });
  }

  return res.status(200).json(booksByAuthor);
});


// -------------------- GET BOOKS BY TITLE --------------------
public_users.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase() === title.toLowerCase()
  );

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: `No books found with title ${title}.` });
  }

  return res.status(200).json(booksByTitle);
});


// -------------------- GET BOOK REVIEWS --------------------
public_users.get('/books/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
  }

  if (!book.reviews || Object.keys(book.reviews).length === 0) {
    return res.status(200).json({ message: "No reviews available for this book." });
  }

  return res.status(200).json(book.reviews);
});


// -------------------- POST A REVIEW --------------------
public_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username, review } = req.body;

  // find book by its ISBN field
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!username || !review) {
    return res.status(400).json({ message: "Username and review are required" });
  }

  // store review per user
  book.reviews[username] = review;

  return res.status(200).json({ 
    message: "Review added/updated successfully", 
    reviews: book.reviews 
  });
});

// -------------------- DELETE A REVIEW --------------------
public_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!username) {
    return res.status(400).json({ message: "Username is required to delete a review" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: `No review found for user ${username}` });
  }

  delete book.reviews[username];
  return res.status(200).json({
    message: "Review deleted successfully",
    reviews: book.reviews
  });
});


module.exports.general = public_users;
