	function slider(options) {
		//default params of slider
		var defaults = {
			id: "#slider",
			duration: 500,
			loopDirection: "down",
			timing: 3000,
			minBrowserWidth: 800
		}
		var options = $.extend(defaults, options); // extend defaults with input object
		var slider = $(options.id),
			amount = slider.find("li").size(),
			ul = slider.find("ul"),
			height = slider.height();
		slider.append("<nav>\n<div id='slider-up'>&uarr;</div>\n<div id='slider-down'>&darr;</div>\n<div id='slider-pause' data-status='loop'>| |</div>\n</nav>");
		// checks the size of the browser and if it less then options.minBrowserWidth - stop slider
		function sizeChecker() {
			height = slider.height();
			var width = $(window).width();
			if(!autoSlider) {
				autoSlider = setInterval(direction, options.timing);
			}
			if(width < options.minBrowserWidth) {
				clearInterval(autoSlider);
				autoSlider = false;
			}
		}
		// select function upper or downer for looping depended on input value of options.loopDirection
		if(options.loopDirection == "up") {
			var direction = upper;
			ul.css("bottom", 100*(amount-1) + "%");
		}
		else {
			var direction = downer;
		}
		// function animator
		function startAnimation(step) {
			ul.finish().animate({
				bottom: step
			}, options.duration);
			var pause = $("#slider-pause");
			pause.html("| |").attr("data-status", "loop");
		}
		// function stopper for the button "pause"
		function stopAnimation() {
			if($(this).attr("data-status") == "loop") { 
				$(this).html("&#9654;");
				$(this).attr("data-status", "stop");
				clearInterval(autoSlider);
			}
			else {
				$(this).html("| |");
				$(this).attr("data-status", "loop");
				autoSlider = setInterval(direction, options.timing);
			}
		}
		// directs the animator func up
		function upper() {
			var pos = ul.css("bottom"),
				step = "-=100%";
			if(parseInt(pos)-height < -1) {
				step = 100*(amount-1) + "%";
			}
			startAnimation(step);
		}
		// directs the animator func down
		function downer() {
			var pos = ul.css("bottom"),
				step = "+=100%";
			if(parseInt(pos)+height > height*(amount-1)+2) {
				step = "0%";
			}
			startAnimation(step);
		}
		// event for down button
		slider.find("#slider-down").click(function() {
			if(autoSlider) clearInterval(autoSlider);
			downer();
			autoSlider = setInterval(direction, options.timing);
		});
		// event for up button
		slider.find("#slider-up").click(function() {
			if(autoSlider) clearInterval(autoSlider);
			upper();
			autoSlider = setInterval(direction, options.timing);
		});
		// event for pause button
		slider.find("#slider-pause").click(stopAnimation);
		// start slider immediately when function slider is launched with direction and timing set
		var autoSlider = setInterval(direction, options.timing);
		// event for resizing browser window
		$(window).resize(sizeChecker);
		// check if browser window is fit to the input parameters when function slider is launched
		sizeChecker();
	}

//using
	$(function() {
		slider({id: "#slider", duration: 600, timing: 5000, loopDirection: "up"});
	});