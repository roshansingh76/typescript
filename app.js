var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
var config = require('./config/config');
var middleware = require('./config/middleware');
var Auth = require('./controller/AuthController');
var Category = require('./controller/CategoryController');
var Product = require('./controller/ProductController');
// Starting point of the server
function main() {
	
	dbconnection();
    var app = express(); // Export app for other routes to use
  
    var port = process.env.PORT || 8000;
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    // Routes & Handlers
    app.post('/login', Auth);
	app.get('/getCategory/',middleware.checkToken,Category);
	app.get('/deleteCategory/:id',middleware.checkToken,Category);
	app.get('/getParentcategory/:id',middleware.checkToken,Category);
	app.post('/addCategory',middleware.checkToken,Category);
	

    app.listen(port, function () { return console.log("Server is listening on port: " + port); });
}


function dbconnection(){
	
	var MongoClient = require("mongodb").MongoClient,
	assert = require("assert");

	// Connection URL
	const url = "";


	// Use connect method to connect to the server
	mongoose.Promise = global.Promise;
	mongoose.connect(url,{ useNewUrlParser: true }, err => {
	if (err) throw err;
		console.log('Successfully connected to database.');
	});

}
main();
