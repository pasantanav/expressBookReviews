const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Testing"});
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author=req.params.author;
  if (author){
      let keys={};
      for (key in books){
          if (books[key].author===author){
              keys[key]={
                  "autor":books[key].author,
                  "title":books[key].title,
                  "review":books[key].review
                }
          }
      }
      return res.send(JSON.stringify(keys, null, 4));
    } else {
        return res.status(401).json({message: "Author not found"});
    }
});
// PUT a review
public_users.put("/auth/review/:isbn", (req,res) => {
    const username = req.body.username;
    const review = req.body.review;
    const isbn=req.params.isbn;
    if (username) {
        if (isValid(username)) {
            let reviews = books[isbn].reviews;
            if (reviews){
                for (rev in reviews){
                    if (rev == username){
                        books[isbn]["reviews"][rev]=review;
                        return res.status(200).json({message: "Review successfully registred"});
                    }
                }
                books[isbn]["reviews"][username] = review;
            } else {
                res.send("Unable to find book");
            }
            return reviews, res.status(200).json({message: "Review successfully registred"});
        } else {
            return res.status(404).json({message: "User invalid!"});
        }
    } 
    return res.status(404).json({message: "Unable to register review."});
});

// DELETE a review
public_users.delete("/auth/review/:isbn", (req,res) => {
    const username = req.body.username;
    const review = req.body.review;
    const isbn=req.params.isbn;
    if (username) {
        if (isValid(username)) {
            let reviews = books[isbn].reviews;
            if (reviews){
                for (rev in reviews){
                    if (rev == username){
                        delete books[isbn]["reviews"][rev];
                        return res.status(200).json({message: "Review successfully deleted"});
                    }
                }
            } else {
                res.send("Unable to find book");
            }
            return reviews, res.status(200).json({message: "Review successfully deleted"});
        } else {
            return res.status(404).json({message: "User invalid!"});
        }
    } 
    return res.status(404).json({message: "Unable to delete review."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    if (title){
        let keys={};
        for (key in books){
            if (books[key].title===title){
                keys[key]={
                    "autor":books[key].author,
                    "title":books[key].title,
                    "review":books[key].review
                  }
            }
        }
        return res.send(JSON.stringify(keys, null, 4));
      } else {
          return res.status(401).json({message: "Author not found"});
      }
    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    return res.send({"Review": books[isbn].reviews});
});

public_users.get('/users',function (req, res) {
    return res.send(JSON.stringify(users, null, 4));
});

module.exports.general = public_users;
