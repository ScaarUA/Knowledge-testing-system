function Test(dataUrl) {
	this.dataUrl = dataUrl;
	this.questionsList = document.getElementById("questions-list");
	this.title = document.getElementById("title");
}

Test.prototype.renderAll = function() {
	this.renderTitle();
	this.renderQuestion();
	this.renderQList();
}
Test.prototype.renderQList = function() {
	var id = this.id;
	var questions = this.data.questions;
	this.questionsList.innerHTML = Templates.qList({id: id, questions: questions});
}
Test.prototype.renderTitle = function() {
	this.title.innerHTML = Templates.test(this.data);
}
Test.prototype.countResults = function() {
	var results = [];
	var answers = this.answers;
	var data = this.data;
	var truthy = 0,
		falsy = 0;
	data.questions.forEach(function(qst, i) {
		var qstNumbString = "question" + (i+1);
		if(qst.rightAnswer == answers[qstNumbString]) {
			results.push(true);
			truthy++
		}else {
			results.push(false);
			falsy++
		}
	});
	var percent = ((truthy/(truthy+falsy))*100).toFixed(1) + "%";
	console.log(percent);
	document.getElementById("content").innerHTML = Templates.result({data: data, results: results, answers: answers, percent: percent, truthy: truthy});
	$(".show-details").showHide({duration: 300});
}
Test.prototype.getData = function() {
	var self = this;
	$.get(this.dataUrl, function(data) {
		self.data = data;
	}).done(function() {
		self.renderAll();
	})
}
Test.prototype.getTestsList = function(url) {
	var self = this;
	$.ajax({
		url: url,
		method: 'GET'
	}).done(function (data){
		self.renderTestsList(data);
	})
}
Test.prototype.renderTestsList = function(data) {
	document.getElementById("content").innerHTML = Templates["tests-list"]({data: data});
	tableSorter("table-test-list");
	searchTest("table-test-list");
}

function Question(dataUrl) {
	this.questionWrap = document.getElementById("question-wrap");
	this.answers = {};
	this.id = 0;
	Test.apply(this, arguments);
}
Question.prototype = Object.create(Test.prototype);
Question.prototype.constructor = Question;

Question.prototype.renderQuestion = function() {
	this.id++;
	this.questionWrap.innerHTML = Templates.question(this.data);
	this.createButton();
}
Question.prototype.createButton = function() {
	var button = document.createElement("button");
		button.textContent = "Ответить";
		button.className = "next";
	this.questionWrap.appendChild(button);
	var self = this;
	addEvent("click", button, function() {
		var choosenAnswer = document.querySelector(".answers input:checked");
		if(!choosenAnswer) {
			choosenAnswer = document.querySelector(".answers input");
			var emptyValue = null;
		}
		self.answers[choosenAnswer.name] = (emptyValue !== undefined) ? emptyValue : choosenAnswer.value;
		console.log(self.answers);
		if(self.id == self.data.questions.length) {
			this.disabled = true;
			self.countResults();
		}
		if(self.id < self.data.questions.length) {
			self.renderQuestion();
			self.renderQList();
		}
	});
}

function getQueryValue(name) {
	var queries = window.location.search.slice(1);
	queries = queries.split("&");
	var obj = {};
	queries.forEach(function (queryStr) {
		var query = queryStr.split("=");
		obj[query[0]] = query[1];
	});
	return obj[name];
}