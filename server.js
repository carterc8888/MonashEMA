/**
 * Create Express Server
 *
 * This module creates an Express server to handle HTTP requests. It sets up
 * middlewares, routes, and starts the server on a specified port.
 *
 * @module ExpressServer
 */

/**
 * Express Application
 *
 * An instance of the Express application that will handle HTTP requests.
 *
 * @type {object}
 * @alias app
 */
const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

/**
 * Connect to MongoDB
 *
 * This asynchronous function connects the server to a MongoDB database.
 *
 * @async
 * @function
 */
async function connect() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test'); //for some reason, it doesn't work with the 'localhost' keyword
    console.log("Connected to MongoDB");
}
connect()
    .catch((err) => console.log(err))

let counterInstance;

/**
 * Create Counter Instance
 *
 * This asynchronous function creates a counter instance for tracking records.
 *
 * @async
 * @function
 */
async function createCounter(){
    const Counter = require("./models/counter");
    counterInstance = await Counter.create({});
}

createCounter().catch((err) => console.log(err));


/**
 * File System Path
 *
 * The path module is used to work with file system paths. It's used here
 * to locate view files and other resources.
 *
 * @type {object}
 * @alias path
 */
const path = require("path");

/**
 * Setting Up Middlewares
 *
 * This block configures various middlewares to be used by the server.
 * It serves Bootstrap CSS files and static images from specified directories.
 */
app.use(express.static("node_modules/bootstrap/dist/css"));
app.use(express.static("images"));
const VIEWS_PATH = path.join(__dirname, '/views/');

/**
 * Configure View Engine
 *
 * This block configures the view engine to render HTML files using EJS.
 * It sets the view engine to 'html' and configures EJS to render HTML files.
 */
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

/**
 * Configuring Routes for Categories - Student 1 Tasks - Carter Chin
 *
 * This block imports and uses the router for category-related routes.
 * It maps the router to the root URL path ('/') to handle category-related requests.
 */
const Counter = require("./models/counter");
const routerCategory = require("./routes/category_json_router");
app.use('/', routerCategory);

/**
 * Configuring Routes for Events - Student 2 Tasks - Zecan Liu
 *
 * This block imports and uses the router for event-related routes.
 * It maps the router to the root URL path ('/') to handle event-related requests.
 */
const eventRouter = require("./routes/event_json_router");
// const Counter = require("./models/counter");
app.use('/', eventRouter);

/**
 * Default Route
 * @function
 * @param {object} request - Express request object.
 * @param {object} response - Express response object.
 * @description This route sends the index.html file to the client when they access the root URL.
 * @name GET /
 */
app.get("/", async function (req, res) {
    let document = await Counter.findOne({});
    let eventsCount = document.eventsCount;
    let categoriesCount =  document.categoriesCount;
    let addCount = document.addCount;
    let updateCount = document.updateCount;
    let deleteCount = document.deleteCount;

    res.render("index",
        {currentEventsCounter: eventsCount,
            currentCategoryCounter: categoriesCount,
            recordsCreated: addCount,
            recordsDeleted: deleteCount,
            recordsUpdated: updateCount});
});

app.get("*", function (request, response) {
    response.redirect('/');
});

/**
 * Start Server
 *
 * This block starts the server on the specified port (8080).
 *
 * @constant
 * @type {number}
 * @default
 */
const PORT_NUMBER = 8080;
app.listen(PORT_NUMBER);
