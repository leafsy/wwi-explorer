var infoWidth = descWidth;
var infoHeight = mapHeight;
var legendTabWidth = 22;
var legendTabHeight = 120;
var legendTabRadius = 5;
var legendWidth = infoWidth-legendTabWidth;

var gLegend;

function showInfo() {

	info = d3.select("#info")
	.attr("width", infoWidth)
	.attr("height", infoHeight);

	drawLegend();

}

var legendOut = false;
function drawLegend() {

	gLegend = info.append("g")
	.attr("transform", "translate("+[-legendWidth,0]+")");

	var gLegendTab = gLegend.append("g")
	.attr("id", "legendTab")
	.attr("transform", "translate("+[legendWidth,0]+")")
	.on("click", function() {
		legendOut = !legendOut;
		if (legendOut) {
			gLegend.transition()
			.attr("transform", "translate(0,0)");
			d3.select(this).select("text").text("Legend \u00a0 \uf103");
		} else {
			gLegend.transition()
			.attr("transform", "translate("+[-legendWidth,0]+")");
			d3.select(this).select("text").text("Legend \u00a0 \uf102");
		}
	});
	gLegendTab.append("rect")
	.attr("rx", legendTabRadius)
	.attr("ry", legendTabRadius)
	.attr("width", legendTabWidth+legendTabRadius)
	.attr("height", legendTabHeight+legendTabRadius)
	.attr("x", -legendTabRadius)
	.attr("y", -legendTabRadius);
	gLegendTab.append("text")
	.attr("font-family","FontAwesome")
	.attr("transform", "rotate(90),translate(25,-5),scale(1.05,1)")
	.text("Legend \u00a0 \uf102");

	var gLegendBox = gLegend.append("g")
	.attr("id", "legendBox");
	gLegendBox.append("rect")
	.attr("width", legendWidth)
	.attr("height", infoHeight);

}