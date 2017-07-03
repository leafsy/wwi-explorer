var infoWidth = descWidth;
var infoHeight = mapHeight;
var legendTabWidth = 22;
var legendTabHeight = 120;
var legendTabRadius = 5;
var legendWidth = infoWidth-legendTabWidth;
var legendMargin = 30;
var legendPadding = 25;
var legendTextX = 90;
var pageMargin = 22;
var tabHeight = 30;
var tabMargin = 5;
var tabPos = [60, 115, 185];
var topics = ["Intro", "People", "Casualties"];

var gLegend, gPages, gTabs;

function showInfo() {

	info = d3.select("#info")
	.attr("width", infoWidth)
	.attr("height", infoHeight);

	drawPages();
	drawLegend();

}

function drawPages() {

	gPages = info.append("g")
	.attr("transform", "translate("+[pageMargin,
									 pageMargin/2+tabHeight]+")");

	var pages = gPages.selectAll("g").data([0,1,2]);
	pages.enter()
	.append("g")
	.merge(pages)
	.attr("class", "page")
	.classed("hidden", function(d) { return d; });

	drawTabs();

	d3.selectAll("g.page")
	.append("rect")
	.attr("width", infoWidth-2*pageMargin)
	.attr("height", infoHeight-pageMargin-tabHeight);

}

function drawTabs() {

	gTabs = info.append("g")
	.attr("transform", "translate("+[0,pageMargin/2]+")");

	var tabs = gTabs.selectAll("g").data([0,1,2]);
	var tab = tabs.enter()
	.append("g")
	.merge(tabs)
	.attr("class", "tab")
	.classed("selected", function(d) { return !d; })
	.attr("transform", function(d) {
		return "translate("+[tabPos[d],0]+")";
	})
	.on("click", function(d) {
		d3.selectAll("g.tab").classed("selected", false);
		d3.select(this).classed("selected", true);
		d3.selectAll("g.page").classed("hidden", function(d1) {
			return d !== d1;
		});
	});
	tab.append("rect")
	.attr("height", tabHeight)
	.attr("width", function(d) {
		if (d === tabPos.length-1) {
			return infoWidth-pageMargin-tabPos[d]-tabMargin;
		}
		return tabPos[d+1]-tabPos[d]-tabMargin;
	});
	tab.append("text")
	.attr("transform", "translate("+[8,8]+")")
	.text(function(d) { return topics[d]; });

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
	.attr("class", "legendBkgrd")
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
	.attr("class", "legendBkgrd")
	.attr("width", legendWidth)
	.attr("height", infoHeight);

	drawLegendContent(gLegendBox);

}

var citiesOut = true;
var battlesOut = true;
function drawLegendContent(g) {

	var currentY = legendMargin;

	g.append("text")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.text("Countries");

	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Neutral states");
	g.append("rect")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.attr("width", 40)
	.attr("height", 15);
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Entente and allies");
	g.append("rect")
	.attr("class", "entente")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.attr("width", 40)
	.attr("height", 15);
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Central Powers");
	g.append("rect")
	.attr("class", "central")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.attr("width", 40)
	.attr("height", 15);
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Occupied territories");
	g.append("rect")
	.attr("class", "_central")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.attr("width", 40)
	.attr("height", 15);
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Defeated states");
	g.append("rect")
	.attr("class", "defeated")
	.attr("x", legendMargin)
	.attr("y", currentY)
	.attr("width", 40)
	.attr("height", 15);
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Pre-war borders");
	g.append("g")
	.attr("class", "countriesB")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("path")
	.attr("d", "M0,7 L40,7 Z");
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Post-war borders");
	g.append("g")
	.attr("class", "bordersAf")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("path")
	.attr("d", "M0,7 L40,7 Z");
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("New Countries");
	g.append("path")
	.attr("class", "newCountry")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.attr("d", "M0,0 L40,0 L40,14 L0,14 Z");

	g.append("text")
	.attr("x", legendMargin)
	.attr("y", currentY += legendPadding*2)
	.text("Cities");

	g.append("text")
	.attr("class", "auxillary")
	.attr("x", 170)
	.attr("y", currentY+3)
	.text("show cities");
	var checkbox1 = g.append("g")
	.attr("class", "checkbox")
	.attr("transform", "translate("+[legendWidth-legendMargin-12,
									 currentY+3]+")")
	.on("click", function() {
		d3.select(this).select("path").classed("hidden", citiesOut);
		d3.selectAll("#map g.cities").classed("inactive", citiesOut);
		citiesOut = !citiesOut;
	});
	checkbox1.append("rect")
	.attr("width", 12)
	.attr("height", 12);
	checkbox1.append("path")
	.attr("d", "M1,5 L6,9 L14,-1");

	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Capitals");
	g.append("g")
	.attr("class", "cities capital")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("circle")
	.attr("r", 4)
	.attr("transform", "translate("+[20,7]+")");
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Major cities");
	g.append("g")
	.attr("class", "cities")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("circle")
	.attr("r", 4)
	.attr("transform", "translate("+[20,7]+")");
	g.append("text")
	.attr("class", "auxillary")
	.attr("x", legendTextX)
	.attr("y", currentY += 20)
	.text("(population > 250,000)");
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Other urban centers");
	g.append("g")
	.attr("class", "cities")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("circle")
	.attr("r", 2.5)
	.attr("transform", "translate("+[20,7]+")");

	g.append("text")
	.attr("x", legendMargin)
	.attr("y", currentY += legendPadding*2)
	.text("Conflicts");

	g.append("text")
	.attr("class", "auxillary")
	.attr("x", 165)
	.attr("y", currentY+3)
	.text("show battles");
	var checkbox2 = g.append("g")
	.attr("class", "checkbox")
	.attr("transform", "translate("+[legendWidth-legendMargin-12,
									 currentY+3]+")")
	.on("click", function() {
		d3.select(this).select("path").classed("hidden", battlesOut);
		d3.selectAll("#map g.battle").classed("inactive", battlesOut);
		d3.selectAll("g.battlelines").classed("inactive", battlesOut);
		battlesOut = !battlesOut;
	});
	checkbox2.append("rect")
	.attr("width", 12)
	.attr("height", 12);
	checkbox2.append("path")
	.attr("d", "M1,5 L6,9 L14,-1");

	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Frontlines");
	g.append("g")
	.attr("class", "front")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("g")
	.append("path")
	.attr("d", "M0,7 L40,7 Z");
	g.append("text")
	.attr("x", legendTextX)
	.attr("y", currentY += legendPadding)
	.text("Important battles");
	g.append("g")
	.attr("class", "battle")
	.attr("transform", "translate("+[legendMargin,currentY]+")")
	.append("path")
	.attr("d", "M0,0 L40,0 L40,14 L0,14 Z");

}

// obsolete:
// var extensionWidth = descWidth-2*descMargin;
// var extensionHeight = 250;
// var gExtension;

// function drawExtension() {

// 	gExtension = info.append("g")
// 	.attr("id", "extentDesc");
// 	gExtension.append("rect")
// 	.attr("x", descMargin)
// 	.attr("y", infoHeight)
// 	.attr("width", extensionWidth)
// 	.attr("height", extensionHeight);

// 	gDesc.on("mouseover", function() {
// 		var cl = gDesc.select("rect").attr("class");
// 		if (!cl) return;
// 		gExtension.select("rect").attr("class", cl);
// 		gExtension.transition()
// 		.attr("transform", "translate("+[0,-extensionHeight]+")");
// 	}).on("mouseout", function() {
// 		gExtension.transition()
// 		.attr("transform", "translate(0,0)");
// 	});
// 	gExtension.on("mouseover", gDesc.on("mouseover"))
// 	.on("mouseout", gDesc.on("mouseout"));

// }