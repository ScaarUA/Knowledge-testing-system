(function($) {
	$.fn.showHide = function(options) {
		var defaults = {
			duration: 200,
			easing: "linear",
			textReplace: false,
			showText: "show",
			hideText: "hide"
		}
		var options = $.extend(defaults, options);

		$(this).click(function() {
			var showHider = $(this);
			var toggleItem = $(this).attr("rel");
			$(toggleItem).slideToggle(options.duration, options.easing, function() {
				if(options.textReplace) {
					$(toggleItem).is(":visible") ? showHider.text(options.hideText) : showHider.text(options.showText);
				}
			});
		})
	}
})(jQuery);

// using:
$(document).ready(function() {
	$(".toggle-menu").showHide({duration: 500});
})