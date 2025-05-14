const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const userNames = users.filter(user => user.username === username);
  if(userNames.length > 0){
      return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(user => user.username === username && user.password === password);
  if(user){
    return true;
  }else{
    return false;
  }
};

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (authenticatedUser(username, password)) {
        // Generate a token for the user
        //  Currently, the token payload contains the user's password (`{ data: password }`), 
        // which is a serious security risk. Even though JWTs are signed, they are not encrypted, 
        // and anyone with access to the token can decode its payload.
        //  Instead, include only non-sensitive information such as the user's ID or username.
        // Example: jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' })

        //  The secret key used here is a simple string ('access'), which is insecure.
        //  Use a strong, random secret key stored in an environment variable.
        // Example: process.env.JWT_SECRET

        //  Token expiration is set correctly (1 hour), but you could also use '1h' for readability.
        //  Example: { expiresIn: '1h' }

        const token = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
          token, username
        }
        return res.status(200).json({message: "User successfully logged in", token});
      } else {
        return res.status(404).json({message: "Invalid username or password"});
      }
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
