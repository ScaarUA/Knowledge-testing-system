var Templates;
$(function() {
	var templates = {};
	var templateNodes = document.querySelectorAll("script[type='text/template']");
	Array.prototype.forEach.call(templateNodes, function(node) {
		id = node.getAttribute("id");
		templates[id] = _.template(node.text);
		Templates = templates;
	});
});