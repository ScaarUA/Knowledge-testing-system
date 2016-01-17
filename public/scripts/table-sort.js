function tableSorter(tableName) {
	var table = document.getElementById(tableName);

	addEvent("click", table, function (e) {
		if(e.target.tagName != "TH" || e.target.innerHTML == "") return;
		//var arrow = table.querySelector(".arrow");
		//var newArrow = arrow.cloneNode(true);
		var tr = table.getElementsByTagName('tr')[0];
		var theadCells = [].slice.call(tr.cells);
		theadCells.forEach(function(cell) {
			cell.style.background = "#8fb2f3";
		});
		//e.target.appendChild(arrow);
		e.target.style.background = "#417ceb";
		sortTable(e.target.cellIndex, e.target.getAttribute("data-type"));
	})

	function sortTable(colNum, type) {
		var tbody = table.getElementsByTagName('tbody')[0];
		var rowsArray = [].slice.call(tbody.rows);

		var compare;
		switch(type){
			case("string"):
				compare = function(a, b) {
					return a.cells[colNum].innerHTML > b.cells[colNum].innerHTML;
				};
				break;
			case("number"):
				compare = function(a, b) {
					return a.cells[colNum].innerHTML - b.cells[colNum].innerHTML;
				};
				break;
		}
		var reserve = [];
		rowsArray.forEach(function(elem) {
			reserve.push(elem);
		});
		rowsArray.sort(compare);
		if(rowsArray.every(function(row, i) {return reserve[i] == row})) rowsArray.reverse();
		rowsArray.forEach(function(row) {
			tbody.appendChild(row);
		});
	}
}