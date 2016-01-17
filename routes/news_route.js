var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'STZ'
});
connection.connect();

router.get('/', function (req,res){
	connection.query("SELECT * FROM news ORDER BY id DESC", function(err, news){
		if(!err) {
			res.json({news});
		}else {
			console.log(err);
		}
	});
});
router.post('/', function (req,res){
	var data = {
		title: req.body.title,
		text: req.body.text,
		date: req.body.date,
		author: req.body.author
	}
	data.text = data.text.replace(/\n/g, "<br>");
	connection.query("INSERT INTO news(title, text, date, author) VALUES ('"+data.title+"', '"+data.text+"', FROM_UNIXTIME("+data.date*0.001+"), '"+data.author+"')", function(err, rows){
		if(!err) {
			res.redirect("/");
		}else {
			console.log(err);
			res.sendStatus(500);
		}
	});
});
router.delete('/', function (req,res){
	var id = req.body.id;
	connection.query("DELETE FROM news WHERE id="+id, function(err, row) {
		if(!err) {
			res.sendStatus(204);
			console.log("deleted value #"+id)
		}else {
			res.send(false);
		}
	});
});

module.exports = router;