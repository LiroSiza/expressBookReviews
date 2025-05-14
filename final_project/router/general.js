const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn]; 
  if(book){
    return res.send(JSON.stringify(book, null, 4));
  }	
  return res.status(404).json({message: "No book found with this ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }
  if(booksByAuthor.length > 0){
    return res.send(JSON.stringify(booksByAuthor, null, 4));
  }
  return res.status(404).json({message: "No book found with this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let titleBooks = [];
  for(let key in books){
    if(books[key].title === title){
      titleBooks.push(books[key]);
    }
  }
  if(titleBooks.length > 0){
    return res.send(JSON.stringify(titleBooks, null, 4));
  }
  return res.status(404).json({message: "No book found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book && book.reviews){
    return res.send(JSON.stringify(book.reviews, null, 4));
  }
  return res.status(404).json({message: "No review found for this book"});
});

module.exports.general = public_users;
