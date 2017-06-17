var infoWidth = descWidth;
var infoHeight = mapHeight;

function showInfo() {

	info = d3.select("#info")
	.attr("width", infoWidth)
	.attr("height", infoHeight);

}