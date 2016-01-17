
function CurrentPage() {
	this.pageLocation = window.location.search;
}
CurrentPage.prototype.getCurrentPage = function() {
	var currentPage = "1";
	if(this.pageLocation !== "") {
		currentPage = this.pageLocation.replace(/.*page=(\d+).*/, "$1");
	}
	return currentPage;
};

function News(newsPerPage, url) {
	CurrentPage.call(this);
	this.newsPerPage = newsPerPage;
	this.url = url;
}

News.prototype = Object.create(CurrentPage.prototype);
News.prototype.constructor = News;

News.prototype.deleteArticles = function() {
	var deleters = document.getElementsByClassName('delete');
	for(var i=0; i<deleters.length; i++) {
		addEvent('click', deleters[i], deleteArticle);
	}
	function deleteArticle() {
		var curId = this.getAttribute('data-id');
		var content = document.getElementById('content');
		var self = this;
		$.ajax({
			url: 'news-data',
			method: 'DELETE',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({
				id: curId
			})
		}).done(function() {
			content.removeChild(self.parentElement);
		});
	}
}

News.prototype.addNews = function(curPage) {
	var content = document.getElementById("content");
	content.innerHTML = Templates.articles(curPage);
};
News.prototype.makeRequest = function(data, page) {
	this.data = data;
	var self = this;
	var url = '/news-data';
	var xhr = new XMLHttpRequest();
	page = page || +this.getCurrentPage();
	try{
		// Opera 8.0+, Firefox, Chrome, Safari
		xhr = new XMLHttpRequest();
	}catch (e){
		// Internet Explorer Browsers
		try{
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e) {
			try{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}catch (e){
				// Something went wrong
				throw new Error("Your browser broke!");
			}
						
		}
	}
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			//console.log(xhr.responseText);
			var text = xhr.responseText;
			//console.log(JSON.parse(text));
			var curPage = JSON.parse(text),
				amount = curPage[self.data].length,
				pages = Math.ceil(amount/self.newsPerPage),
				pageLine = document.getElementById("pageLine"),
				firstArticle = self.newsPerPage*(page-1);
			curPage[self.data] = curPage[self.data].slice(firstArticle, self.newsPerPage*page);
			self.addNews(curPage);
			self.deleteArticles();
			if(!pageLine) {
				self.createNavigation(pages);
			}
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
};

function Navigation(newsPerPage) {
	this.content = document.getElementById("content");
	this.section = this.content.parentElement;
	News.apply(this, arguments);
}

Navigation.prototype = Object.create(News.prototype);
Navigation.prototype.constructor = Navigation;

Navigation.prototype.createNavigation = function(pages) {
	var self = this;
	var pageLine = document.createElement("div");
		pageLine.id = "pageLine";
		this.section.appendChild(pageLine);
	for(var i=1; i<=pages; i++) { 
		var pageId = document.createElement("div");
		pageId.className = "page-id";
		if(i == +this.getCurrentPage()) pageId.className += " page-active";
		pageId.innerHTML = i;
		pageId.setAttribute("data-id", i); 
		pageLine.appendChild(pageId);
		addEvent("click", pageId, changePage);
	}
	function changePage() {
		var id = this.getAttribute("data-id");
		var buttons = document.getElementsByClassName("page-id");
		for(var i=0; i<buttons.length; i++) { 
			buttons[i].className = "page-id";
		}
		this.className = "page-id page-active";
		var path = window.location.pathname;
		history.pushState('', '', path+'?page='+id);
		$("#content").fadeOut('fast', function() {
			self.makeRequest(self.data, id); ///
			$(this).fadeIn("fast", scrollUp);
		});	
	}
	function scrollUp() {
		var sectionTopPos = self.section.offsetTop;
		if(self.section.scrollTop > 0) {
			$("#section").animate({scrollTop: 0}, 500);
		}
		if(document.body.scrollTop > sectionTopPos) {
			$("body").animate({scrollTop: sectionTopPos}, 500);
		}
	};
};