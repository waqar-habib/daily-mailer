// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var path = require('path');

// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Setting the PORT
var PORT = 5000;

// MongoDB connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";
mongoose.connect(MONGODB_URI);

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static(path.join(__dirname, '/public')));

// Main route to index.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// GET route that scrapes the articles using cheerio and axios
app.get("/scrape", function (req, res) {
  axios.get("https://www.aljazeera.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    
    // Targeted Div on the website that contains the articles needed
    $("div.mts-title-wrap").each(function (i, element) {

      // Store data in an object
      var result = {};

      result.title = $(this).children("h1").text();
      result.url = $(this).children("h1").children("a").attr("href");
      result.blurb = $(this).siblings("p").text();

      // Create a collection in Mongo using the schema in Article.js and documents using result
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        })
      console.log(result);
    });

    // Redirect client to scrape.html
    res.sendFile(__dirname + '/public/scrape.html');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  console.log(req.params.id);
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.findOne({ _id: req.params.id })
    //console.log({ _id: req.params.id });
    // ..and populate all of the notes associated with it
    //.populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Listen on port 5000
app.listen(PORT, function () {
  console.log("App running on port 5000!");
});