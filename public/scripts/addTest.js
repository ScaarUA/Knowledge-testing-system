function TestAdder(addQuestionButtonId, addTestButtonId) {
	this.id = 1;
	this.data = {title: null, questions: []};
	this.incr = 3;
	this.addQstBtn = document.getElementById(addQuestionButtonId);
	var self = this;
	addEvent("click", this.addQstBtn, function() {
		self.getQuestion();
	});
	this.addTestBtn = document.getElementById(addTestButtonId);
	addEvent("click", this.addTestBtn, function() {
		self.addTest();
	});
}
TestAdder.prototype.renderQuestionForm = function(formId, addAnswerButtonId) {
	if(formId !== undefined) this.formId = formId;
	if(addAnswerButtonId !== undefined) this.addAnswerButtonId = addAnswerButtonId;
	var id = this.id,
		self = this;
	if(id > 1) {
		this.addTestBtn.removeAttribute("disabled");
	}
	document.getElementById(this.formId).innerHTML = Templates.question({id: id});
	var addAnswerButton = document.getElementById(this.addAnswerButtonId);
	addEvent("click", addAnswerButton, function() {
		self.appendAnswer();
	});
}
TestAdder.prototype.getQuestion = function() {
	var question = document.querySelector("input[name='question']").value,
		code = document.querySelector("textarea[name='code']").value,
		answers = document.querySelectorAll(".inp-answers"),
		inpRightAnswer = document.querySelector("input[name='rightAnswer']:checked"),
		rightAnswer = parseInt(inpRightAnswer.value);
	code = code.replace(/\n/g, "<br>");
	answers = Array.prototype.map.call(answers, function (elem) {
		return elem.value;
	});
	function isEmpty(val) {
		return val == "";
	}
	console.log(question);
	if(question == "" || answers.every(isEmpty)) {
		alert("Введите все обязательные значения");
		return
	}
	//console.log(question, answers);
	this.data.questions.push({
		'question': question,
		'code': code,
		'answers': [],
		'rightAnswer': rightAnswer
	});
	var self = this;
	answers.forEach(function (ans) {
		self.data.questions[self.id-1].answers.push(ans);
	})
	this.id++;
	this.renderQuestionForm();
	this.addToPreview();
	this.incr = 3;
	console.log(this.data);
}
TestAdder.prototype.addToPreview = function() {
	var previewBlock = document.getElementById("questions-preview");
	var data = this.data;
	previewBlock.innerHTML = Templates['questions-preview-template']({data: data});
	var id = data.questions.length-1;
	var newQuestionDeleteBtns = document.querySelectorAll("a.q-delete");
	var self = this;
	for(var i=0; i<newQuestionDeleteBtns.length; i++) {
		addEvent("click", newQuestionDeleteBtns[i], function(e) {
			var id = parseInt(e.target.getAttribute("data-id"), 10);
			self.data.questions.splice(id, 1);
			self.id--;
			if(self.id <= 1) {
				self.addTestBtn.setAttribute("disabled", true);
			}
			self.addToPreview();
		})
	}
}
TestAdder.prototype.appendAnswer = function() {
	var form = document.getElementById("questionForm");
	var button = document.getElementById("add-answer");
	var answer = document.querySelector(".answer").cloneNode(true);
	var rightAnswerRadio = answer.querySelector("input[type='radio']"),
		answerInput = answer.querySelector("input[type='text']"),
		answerLabel = answer.querySelector("label");
	rightAnswerRadio.value = this.incr-1;
	rightAnswerRadio.removeAttribute("checked");
	rightAnswerRadio.id = "r-" + (this.incr-1);
	answerInput.name = "answer" + this.incr;
	answerInput.value = "";
	answerLabel.setAttribute("for", "r-" + (this.incr-1));
	form.insertBefore(answer, button);
	this.incr++;
}
TestAdder.prototype.addTest = function() {
	var title = document.querySelector("input[name='title']").value;
	this.data.title = title;
	var fileName = rusToFileName(title);
	this.data.fileName = fileName;
	var time = 60*parseInt(document.querySelector("select[name='time']").value, 10);
	this.data.time = time;
	var data = this.data;
	$.ajax({
		url: '/tests/addTest',
		method: "POST",
		dataType: "json",
		contentType: "application/json",
		data: JSON.stringify(data)
	}).done(function() {
		window.location.href = "/tests";
	})
}

function rusToFileName(str) {
	var result = str;
	var rusEng = 	[["а",  "a"],  ["б",  "b"],  ["в",   "v"],
					 ["г",  "g"],  ["д",  "d"],  ["е",   "e"],
					 ["ё",  "e"],  ["ж",  "j"],  ["з",   "z"],
					 ["и",  "i"],  ["й",  "y"],  ["к",   "k"],
					 ["л",  "l"],  ["м",  "m"],  ["н",   "n"],
					 ["о",  "o"],  ["п",  "p"],  ["р",   "r"],
					 ["с",  "s"],  ["т",  "t"],  ["у",   "u"],
					 ["ф",  "f"],  ["х",  "h"],  ["ц",  "ts"],
					 ["ч", "ch"],  ["ш", "sh"],  ["щ", "sch"],
					 ["ъ",   ""],  ["ы",  "y"],  ["ь",   "'"],
					 ["э",  "e"],  ["ю",  "u"],  ["я",  "ja"]];
	var rus = 0,
		eng = 1;
	rusEng.forEach(function (letter) {
		var regex = new RegExp(letter[rus], "gi");
		result = result.replace(regex, letter[eng]);
	});
	return result.replace(/[^\w\s]/g, "").trim().replace(/ /g, "_");
}