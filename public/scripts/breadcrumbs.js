function appendBreadCrumbs(titles) {
	var breadCrumbs = $("#bread-crumbs");
	var currentLocation = window.location.pathname.split("/");
	currentLocation = _.filter(currentLocation, function(a){
		return a != "";
	});
	currentLocation.unshift("main");
	var path = "/";
	for(var i=0; i<currentLocation.length; i++) {
		if(i!=0) path += currentLocation[i] + "/";
		var locationText = titles[currentLocation[i]] || ""/*  */,
			link = '<a href="'+path+'">'+locationText+'</a>',
			arrow = '<span class="arrow"> -> </span>';
		breadCrumbs.append(link);
		//console.log(link);
		if(i != currentLocation.length-1) {
			breadCrumbs.append(arrow);
		}
	}	
}

appendBreadCrumbs({
	"main": "Главная",
	"tests": "Тесты",
	"gallery": "Галлерея",
	"contacts": "Контакты",
	"add_test": "Добавить тест",
	"test_pass": "Прохождение теста"
});