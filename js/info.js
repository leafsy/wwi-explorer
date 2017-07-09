var infoWidth = descWidth;
var infoHeight = mapHeight;
var legendTabWidth = 22;
var legendTabHeight = 120;
var legendTabRadius = 5;
var legendWidth = infoWidth-legendTabWidth;
var legendMargin = 30;
var legendPadding = 25;
var legendTextX = 90;
var tabHeight = 30;
var tabMargin = 5;
var tabPos = [60, 115, 185];
var topics = ["Intro", "People", "Casualties"];
var pageMargin = 22;
var pageWidth = infoWidth-2*pageMargin;
var pageHeight = infoHeight-pageMargin-tabHeight;
var contentPadding = 20;
var graphWidth = 210;
var graphHeight = 340;
var graphBarWidth = 10;
var maxCasualties = 9500000;

var introText = [
	["h3","Overview"],
	["p","One hundred years ago, Europe was embroiled in a conflag-ration of unprecedented scale. It started with an assassination and ended with the loss of 15 million lives; it gave birth to weapons of unspeakable horror and left behind a generation thirsting for revenge; it shatter-ed old empires and, from their ashes, ushered in the modern age. The Great War was the seminal catastrophe of the 20th century, and we can learn much about the world we find our-selves in today by studying events that took place a hun-dred years prior."],
	["p","This project aims to present important events and battles of the war by placing them in time as well as space. It covers the pivotal five years between June 1914 and June 1919 on the European continent, with em-phasis placed on military and political history. The project serves mainly as a portal with links to information about the Western, Eastern, Balkan/Mace-donian (including Gallipoli) and Italian Fronts."],
	["p","(Note: 1914 borders are used throughout the course of the war and may not represent comtemporary demarcations.)"],
	["h3","How to Use"],
	["ul", ["Zoom in on map for details of cities and borders;",
			"Scroll, drag, or hit the play button to travel along the timeline;",
			"See the evolution of frontlines and alliances;",
			"Click on event descriptions to get more information;",
			"Change visibility of map layers in the legend;",
			"View important figures and casualties data"]]
	];
var frontCategories = ["Western", "Eastern", "Italian", "Balkans"];
var centralCountries = ["Germany", "Austria", "Turkey", "Bulgaria"];
var peopleCategories = ["Entente/Allies", "Central Powers"];

var gLegend, gPages, gTabs;
var introContent;
var gFrontButtons, gFrontGraphs;
var gPeopleButtons, gPeopleLists;

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
	.classed("hidden", function(d) { return d; })
	.append("rect")
	.attr("width", pageWidth)
	.attr("height", pageHeight);

	d3.selectAll("g.page")
	.each(function(d) {
		if (d === 0) return fillIntro(d3.select(this));
		if (d === 1) return fillPeople(d3.select(this));
		if (d === 2) return fillCasualties(d3.select(this));
	});;

	drawTabs();

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

function fillIntro(page) {

	introContent = page.append("foreignObject")
	.attr("x", contentPadding-3)
	.attr("y", contentPadding)
	.append("xhtml:div")
	.attr("id", "infoDiv")
	.attr("xmln", "http://www.w3.org/1999/xhtml")
	.style("width", pageWidth-2*contentPadding)
	.style("height", pageHeight-2*contentPadding);
	introText.forEach(function(t) {
		var element = introContent.append("xhtml:"+t[0]);
		if (t[0] === "ul") {
			t[1].forEach(function(l) {
				element.append("xhtml:li").text(l);
			});
		} else {
			element.text(t[1]);
		}
	});

}

function fillPeople(page) {

	gPeopleButtons = page.append("g")
	.attr("class", "buttons")
	.attr("transform", "translate("+[contentPadding,contentPadding]+")");

	var mouseclick = function(d) {
		gPeopleButtons.selectAll(".selected").classed("selected", false);
		d3.select(this).classed("selected", true);
		d3.selectAll(".peopleDiv").classed("hidden", function(d1) {
			return d !== d1;
		});
	}

	var buttons = gPeopleButtons.selectAll("text").data(peopleCategories);
	buttons.enter()
	.append("text")
	.merge(buttons)
	.classed("selected", function(d) {
		return d === peopleCategories[0];
	})
	.attr("transform", function(d) {
		var i = peopleCategories.indexOf(d);
		return "translate("+[i*110,0]+")";
	})
	.on("click", mouseclick)
	.text(function(d) { return d; });

	gPeopleLists = page.append("foreignObject")
	.attr("x", contentPadding-3)
	.attr("y", 50);
	var divs = gPeopleLists.selectAll("div").data(peopleCategories);
	divs.enter()
	.append("xhtml:div")
	.merge(divs)
	.attr("class", "peopleDiv")
	.classed("hidden", function(d) {
		return d !== peopleCategories[0];
	})
	.attr("xmln", "http://www.w3.org/1999/xhtml")
	.style("width", pageWidth-2*contentPadding)
	.style("height", pageHeight-2*contentPadding-50);

	updatePeople(new Date("6/20/1914"));

}

function updatePeople(date) {

	var divs = gPeopleLists.selectAll("div");
	divs.html(null)
	.each(function(d1) {
		var div = d3.select(this);
		people.forEach(function(d) {
			if (d.start <= date && d.end >= date
				&& peopleCategories.indexOf(d1) !== d.is_allies) {
				div.append("xhtml:h4").text(d.name)
				.on("click", function() { window.open(d.link); });
				div.append("xhtml:h5").text(d.title);
			}
		});
	});

}

function fillCasualties(page) {

	gFrontButtons = page.append("g")
	.attr("class", "buttons")
	.attr("transform", "translate("+[contentPadding,contentPadding]+")");

	var mouseclick = function(d) {
		gFrontButtons.selectAll(".selected").classed("selected", false);
		d3.select(this).classed("selected", true);
		d3.selectAll(".graph").classed("hidden", function(d1) {
			return d !== d1;
		});
	}

	var buttons = gFrontButtons.selectAll("text").data(frontCategories);
	buttons.enter()
	.append("text")
	.merge(buttons)
	.attr("class", function(d) { return d; })
	.classed("selected", function(d) {
		return d === frontCategories[0];
	})
	.attr("transform", function(d) {
		var i = frontCategories.indexOf(d);
		return "translate("+[i*62-(i>1)*6-(i>2)*12,0]+")";
	})
	.on("click", mouseclick)
	.text(function(d) { return d; });

	gFrontGraphs = page.append("g")
	.attr("transform", "translate("+[35,55]+")");

	var graphs = gFrontGraphs.selectAll("g").data(frontCategories);
	graphs.enter()
	.append("g")
	.merge(graphs)
	.attr("class", function(d) { return "graph "+d; })
	.classed("hidden", function(d) {
		return d !== frontCategories[0];
	})
	.each(drawGraph);

}

function drawGraph(d) {

	var graph = d3.select(this);
	var data = casualties[0].fronts[d];
	var domain = Object.keys(data);

	var xScale = d3.scaleBand()
	.domain(domain)
	.range([0,graphWidth]);
	var yScale = d3.scaleLinear()
	.domain([0,maxCasualties])
	.range([graphHeight,0]);

	var xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
	graph.append("g")
	.attr("class", "axis")
	.attr("transform", "translate("+[0,graphHeight]+")")
	.call(xAxis)
	.selectAll("text")
    .attr("transform", "translate(12,8),rotate(90)")
    .style("text-anchor", "start");
	var yAxis = d3.axisLeft(yScale).tickFormat(d3.format(".1s"));;
	graph.append("g")
	.attr("class", "axis")
	.call(yAxis);

	var bars = graph.selectAll("rect").data(domain);
	bars.enter()
	.append("rect")
	.merge(bars)
	.attr("class", function(d) {
		return centralCountries.includes(d)? "central":"entente";
	})
	.attr("x", function(d) {
		return xScale(d) + xScale.bandwidth()/2 - graphBarWidth/2;
	})
	.attr("y", graphHeight)
	.attr("width", graphBarWidth)
	.append("title");

}

var currentCasualties;
function updateCasualties(date) {

	for (var i = 0; i < casualties.length; i++) {
		if (casualties[i].date > date) {
			currentCasualties = casualties[i-1].fronts;
			break;
		}
	}
	gFrontGraphs.selectAll("g").each(updateGraph);

}

function updateGraph(d) {

	var casScale = d3.scaleLinear()
	.domain([0,maxCasualties])
	.range([0,graphHeight]);

	d3.select(this).selectAll("rect")
	.attr("height", function(d1) {
		return casScale(currentCasualties[d][d1]);
	})
	.attr("transform", function(d1) {
		return "translate("+[0,-casScale(currentCasualties[d][d1])]+")";
	})
	.select("title")
	.text(function(d1) {
		return d1+": "+Math.round(currentCasualties[d][d1]/100)*100;
	});

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