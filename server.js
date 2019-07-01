// DB NAME: scraper

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

//Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get("/scrape", function (req, res) {
  axios.get("https://www.aljazeera.com/").then(function (response) {
    var $ = cheerio.load(response.data);

    $("div.mts-title-wrap").each(function (i, element) {

      var result = {};

      result.title = $(this).children("h1").text();
      result.url = $(this).children("h1").children("a").attr("href");
      result.blurb = $(this).siblings("p").text();

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        })
      console.log(result);
    });

    // Send a message to the client
    res.send("Scrape Complete");
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
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    //console.log({ _id: req.params.id });
    // ..and populate all of the notes associated with it
    //.populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
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