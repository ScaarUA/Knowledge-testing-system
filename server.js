//modules
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var ejs = require("ejs");
var jsonfile = require('jsonfile');
var fs = require('fs');

var news = require('./routes/news_route');
var tests = require('./routes/tests_route');

//api
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/news-data', news);
app.use('/tests', tests);

app.use('/', express.static(__dirname+"/public"));
app.listen(3000, function() {
	console.log("Server is running at port 3000")
});