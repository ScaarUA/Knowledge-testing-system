var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jsonfile = require('jsonfile');
var fs = require('fs');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'STZ'
});
connection.connect();

router.get('/list', function (req,res){
	connection.query("SELECT * FROM tests ORDER BY id DESC", function (err, tests) {
		if(!err) {
			res.json(tests);
		}else {
			console.log(err);
		}
	})
});
router.post('/', function (req,res){
	var answers = req.body;
	res.send(answers);
});
router.post("/addTest", function (req,res){
	var file = '/tests/' + req.body.fileName + ".json",
		title = req.body.title,
		numberOfQuestions = req.body.questions.length,
		time = req.body.time;
	
	jsonfile.writeFile("./public"+file, req.body, function (err) {
		if(err) {
	  		console.error(err)
		}else {
			connection.query("INSERT INTO tests(name, qstAmount, time, url) VALUES('"+title+"','"+numberOfQuestions+"', '"+time+"', '"+file+"')", function (err) {
				if(err) {
			  		console.error(err);
			  		res.sendStatus(500);
				}else{
					res.sendStatus(204);
				}
			})
		}
	});
});

module.exports = router;