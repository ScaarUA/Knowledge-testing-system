// set amount in seconds
function Timer(amount) {
	this.amount = amount;
	this.minutes = Math.floor(this.amount/60);
	this.seconds = this.amount - this.minutes*60;
}

Timer.prototype.renderTimer = function() {
	if(!this.element) this.element = document.getElementById("timer");
	var minutes = this.minutes + "",
		seconds = this.seconds + "";
	if(seconds.length == 1) seconds = 0 + seconds;
	if(minutes.length == 1) minutes = 0 + minutes;
	this.element.innerHTML = minutes + ":" + seconds;
}
Timer.prototype.count = function(obj) {
	this.amount--;
	if(this.amount < 0) {
		clearInterval(this.interval);
		obj.countResults();
	}else {
		this.minutes = Math.floor(this.amount/60);
		this.seconds = this.amount - this.minutes*60;
		this.renderTimer();
	}
}
Timer.prototype.launch = function(obj) {
	this.renderTimer();
	var self = this;
	this.interval = setInterval(function() {
		self.count(obj);
	}, 1000);
}