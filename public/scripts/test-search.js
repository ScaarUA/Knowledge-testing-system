function searchTest(tableName) {
	var searchInp = document.querySelector(".search-inp");
	var table = document.getElementById(tableName),
		tbody = table.getElementsByTagName("tbody")[0];
	var tbodyRows = Array.prototype.slice.call(tbody.rows);

	addEvent("input", searchInp, function(e) {
		$("#"+tableName+" tbody").empty();
		search(e.target.value);
	})

	function search(text) {
		rowsCopy = tbodyRows.filter(function (row) {
			var lowerCell = row.cells[1].innerText.toLowerCase();
			return lowerCell.indexOf(text.toLowerCase()) != -1;
		});
		rowsCopy.forEach(function (row) {
			tbody.appendChild(row);
		})
	}
}