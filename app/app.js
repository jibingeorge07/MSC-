// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the models
const { User } = require("./models/user");

// Create a route for root - /
app.get("/", function(req, res) {
    // Set up an array of data
    // Send the array through to the template as a variable called data
    res.render("index");
});

app.get("/RSVP", function(req, res) {
    res.render("RSVP");
});

// Task 2 display a formatted list of students
app.get("/admin", function(req, res) {
    var sql = 'select * from UserProfile';
    db.query(sql).then(results => {
    	    // The rows will be in a variable called data
        res.render('all_users', {data: results});
    });
});

// Single student page, using MVC pattern
app.get("/single_user/:id", async function (req, res) {
    var stId = req.params.id;
    var user = new User(stId);
    await user.getUserDetails();
    await user.getCakeName();
    await user.getVenuesName();
    await user.getDecorationName();
    await user.getFlowerName();
    res.render('user', {user:user});
});


// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});