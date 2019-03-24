// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();



// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));




// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true });




// Main route


app.get("/", function (req, res) {

  db.Article.find({})
    .then(function (dbArticle) {
      // If all articles are successfully found, send them back to the client
      var hbsObject = {
        articles: dbArticle
      };

      res.render("index", hbsObject);

    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});






// Retrieve data from the db
app.get("/saved", function (req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({ saved: true })
    .then(function (dbArticle) {
      // If all articles are successfully found, send them back to the client
      var hbsObject = {
        articles: dbArticle
      };

      res.render("saved", hbsObject);

    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("https://www.huffpost.com/").then(function (response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);


    // For each card__headlines class
    $(".card__headlines").each(function (i, element) {
      // Save the headline, summary and link

      var link = $(element).children(".card__headline").children("a").attr("href");
      var headline = $(element).children(".card__headline").children("a").children(".card__headline__text").text();
      var summary = $(element).children(".card__description").children("a").text();

      // If this found element had both a headline and a link
      if (headline && link) {
        // Insert the data in the scrapedData db
        db.Article.create({
          headline: headline,
          summary: summary,
          link: link
        })
          .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
          });
      };
    });

    // Send a complete message to the browser

    res.send("Completed loading news data");
  });
});


app.get("/clear", function (req, res) {

});

// Scrape data from one site and place it into the mongodb db
app.put("/save/:id", function (req, res) {


  db.Article.findOneAndUpdate({ _id: req.params.id }, { "saved": true }, { new: true })


    .then(function (dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.send("Successfully saved");
    })
    .catch(function (err) {
      // If an error occurred, log it
      console.log(err);
      res.send("Error occurred saving article");
    });

});

// Scrape data from one site and place it into the mongodb db
app.put("/delsave/:id", function (req, res) {


  db.Article.findOneAndUpdate({ _id: req.params.id }, { "saved": false }, { new: true })


    .then(function (dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.send("Successfully saved");
    })
    .catch(function (err) {
      // If an error occurred, log it
      console.log(err);
      res.send("Error occurred saving article");
    });

});


app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {  $push: { notes: dbNote._id }}, { new: true });
     
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("notes")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});





// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
