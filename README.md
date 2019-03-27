# mongoScraper

### Overview

MongoScraper the Huffington Post Edition is an interactive app that enables users to scrape news articles from the Huffington Post. The user can save articles and add, view and delete notes to the articles that have been saved.

This application is deployed on Heroku at https://guarded-scrubland-50215.herokuapp.com/



### Dependencies

package.json lists the dependencies that are needed. 
This includes axios, cheerio, express, express-handlebars, mongojs, mongoose and morgan.

### Implementation

This application was developed using Node.js, Express, Handlebars with Bootstrap and a MongoDB database. All database access and models are done using Mongoose. Handlebars and Bootstrap are used to present the view to the user.  The models directory contains the database schema for both the articles and notes collections. The server creates all the necessary routes and the logic within those routes and uses Cheerio to do web scraping.

When run locally, the database is a local database. When running the version deployed on Heroku, a mLab mongoDB database is used.







