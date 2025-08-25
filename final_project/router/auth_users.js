const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.includes(username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.find(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (!isValid(username)) {
    return res.status(401).json({message: "Invalid username"});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid password"});
  }
  return res.status(200).json({message: "Login successful"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const {isbn} = req.params;
  const {review} = req.body;
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  books[isbn].reviews.push(review);
  return res.status(200).json({message: "Review added successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
