const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
public_users.get('/', async function (req, res) {
  //return res.send(JSON.stringify(books, null, 4));
  try{
    const data = await Promise.resolve(books);
    if (data){
        res.json(data);
    } else {
        res.json(Promise.reject(new Error("Promise rejected")));
    }
  } catch (err){
      console.log(err);
  }
});

// Get promise book details based on ISBN
function getISBNBook(ISBN) {
    return new Promise((resolve, reject) => {
        //let isbnNum = parseInt(ISBN);
        if (books[ISBN]) {
            resolve(books[ISBN]);
        } else {
            reject({status:404, message:`Book with ISBN${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn=req.params.isbn;
    getISBNBook(isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
/*public_users.get('/isbn/:isbn',function (req, res) {
  const isbn=req.params.isbn;
  return res.send(books[isbn]);
 });*/
  
// Get book details based on author
const getBooksAuthor = async author => {
    try{
        if (author){
          let authors={};
          for (key in books){
              if (books[key].author===author){
                  authors[key]={
                      "autor":books[key].author,
                      "title":books[key].title,
                      "review":books[key].review
                    }
              }
            }
            return Promise.resolve(authors);
        } else {
            return Promise.reject(new Error('Promise rejected, author not found'));
        }
    } catch (error) {
		console.log(error);
	}
}

public_users.get('/author/:author', async function (req, res) {
    const author= req.params.author;
    const data = await getBooksAuthor(author);
    res.send(data);
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
const getBooksTitle = async title => {
    try{
        if (title){
            let titles={};
            for (key in books){
                if (books[key].title===title){
                    titles[key]={
                        "autor":books[key].author,
                        "title":books[key].title,
                        "review":books[key].review
                      }
                }
            }
            return Promise.resolve(titles);
        } else {
            return Promise.reject(new Error('Promise rejected, title not found'));
        }
    } catch (error) {
		console.log(error);
	}
};
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const data = await getBooksTitle(title);
	res.send(data);
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
