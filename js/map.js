var mapWidth = 700;
var mapHeight = 520;
var maxZoom = 4;
var minZoom = 1;
var initT = [200,1060];
var initS = 800;
var majorRadius = 2.5;
var majorWidth = 1.2;
var minorRadius = 1;
var cityFontSize = 10;
var popCutoff = 250000;
var lngCutoff = 33;
var scaleCutoff = 3;
var labelMargin = 20;
var labelHeight = 33;
var clabelMargin = 4;
var clabelHeight = 6;
var clabelFontSize = 4;
var focusRadius = 15;
var focusWidth = 2.9;

var zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom])
    .on("zoom", redraw);

var projection = d3.geoMercator();
projection.translate(initT);
projection.scale(initS);
var pathGenerator = d3.geoPath().projection(projection);

var map, gCountriesB, gCountriesA, gRivers, gCities;
var focus, gLabel, gCLabel;

function showMap() {
	
	map = d3.select("#map")
	.attr("width", mapWidth)
	.attr("height", mapHeight)
	.call(zoom);
	map.append("rect")
	.attr("width", mapWidth)
	.attr("height", mapHeight)
	.attr("opacity", 0)
	.on("mouseover", function() {
		d3.selectAll("path.hover").classed("hover", false);
		gLabel.classed("hidden", true);
	});

	drawCountriesBelow();
	drawCountriesAbove();
	//drawRivers();
	drawCities();

	focus = map.append("circle")
	.attr("id", "focus")
	.attr("class", "hidden")
	.attr("r", focusRadius)
	.attr("stroke-width", focusWidth)
	.attr("stroke-dasharray", focusWidth);

	gLabel = map.append("g")
	.attr("class", "label hidden");
	gLabel.append("rect")
	.attr("height", labelHeight);
	gLabel.append("text")
	.attr("transform", "translate("+[labelMargin,labelMargin]+")");

	gCLabel = map.append("g")
	.attr("class", "label hidden inactive");
	gCLabel.append("rect")
	.attr("height", clabelHeight)
	.attr("rx", clabelMargin/2).attr("ry", clabelMargin/2);
	gCLabel.append("text")
	.attr("font-size", clabelFontSize)
	.attr("transform", "translate("+[clabelMargin,clabelMargin]+")");

}

function drawCountriesBelow() {

	gCountriesB = map.append("g").attr("class", "countriesB");

	var paths = gCountriesB.selectAll("path").data(countries);
	paths.enter()
	.append("path")
	.merge(paths)
	.attr("d", pathGenerator);

}

function drawCountriesAbove() {

	gCountriesA = map.append("g").attr("class", "countriesA");

	var paths = gCountriesA.selectAll("path").data(countries);
	paths.enter()
	.append("path")
	.merge(paths)
	.attr("d", pathGenerator)
	.on("mouseover", function(d) {
		d3.selectAll("path.hover").classed("hover", false);
		d3.select(this).classed("hover", true);
		gLabel.classed("hidden", false);
		gLabel.select("text").text(d.properties.country);
		var label = gLabel.select("text").nodes()[0];
		gLabel.select("rect")
		.attr("width", label.getBBox().width + 2*labelMargin);
	});

}

function drawRivers() {

	gRivers = map.append("g").attr("class", "rivers");

	var paths = gRivers.selectAll("path").data(rivers.geometries);
	paths.enter()
	.append("path")
	.merge(paths)
	.attr("d", pathGenerator);

}

function drawCities() {

	var capitals = ["Paris","Berlin","Vienna","London","St. Petersburg",
					"Lisbon","Amsterdam","Budapest","Madrid","Brussels","Belgrade",
					"Rome","Copenhagen","Bucharest","Durres","Sofia","Athens",
					"Stockholm", "Podgorica", "Bern", "Oslo", "Constantinople",];
	gCities = map.append("g").attr("class", "cities");

	var popExtent = d3.extent(cities, function(d) { return d.pop; });
	var popScale = d3.scaleSqrt().domain(popExtent).range([2,0.5]);

	var points = gCities.selectAll("g").data(cities);
	var point = points.enter()
	.append("g")
	.merge(points)
	.attr("class", function(d) {
		if (d.pop >= popCutoff) return "major";
		return "minor hidden";
	})
	.classed("capital", function(d) {
		return capitals.includes(d.city);
	});

	var mouseover = function(d) {
		var center = [Number(d3.select(this).attr("cx"))+1,
					  Number(d3.select(this).attr("cy"))+1];
		var text = gCLabel.select("text");
		text.text(d.city);
		var width = text.nodes()[0].getBBox().width + 2*clabelMargin;
		if (d.lng > lngCutoff) { center[0] -= width+1; }
		else if (d.city == "Gibraltar") { center[1] -= clabelHeight; }
		
		var translate = gCities.attr("transform");
		gCLabel.classed("hidden", false)
		.attr("transform", translate)
		.select("rect")
		.attr("x", center[0]).attr("y", center[1])
		.attr("width", width);
		text.attr("x", center[0]).attr("y", center[1]);
	}

	point.append("circle")
	.attr("cx", function(d) {
		return projection([d.lng, d.lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.lng, d.lat])[1];
	})
	.attr("r", function(d) {
		if (d.pop >= popCutoff) return majorRadius;
		return minorRadius;
	})
	.attr("stroke-width", function(d) {
		if (d.pop >= popCutoff) return majorWidth;
	})
	.on("mouseover", mouseover)
	.on("mouseout", function(d) {
		gCLabel.classed("hidden", true);
	});

	point.append("text")
	.attr("class", function(d) {
		if (d.pop < popCutoff) return "hidden";
	})
	.attr("x", function(d) {
		var offset = 4;
		if (d.city == "Brussels") offset = -5;
		else if (d.city == "Liverpool") offset = 0;
		else if (d.city == "Bristol") offset = 0;
		return projection([d.lng, d.lat])[0]+offset;
	})
	.attr("y", function(d) {
		var offset = 2;
		if (d.city == "Manchester") offset = -3;
		else if (d.city == "Bristol") offset = 11;
		else if (d.city == "Liverpool") offset = 11;
		else if (d.city == "Brussels") offset = 11;
		else if (d.city == "Antwerp") offset = 0;
		else if (d.city == "Leipzig") offset = -3;
		return projection([d.lng, d.lat])[1]+offset;
	})
	.attr("font-size", cityFontSize)
	.text(function(d) {
		return d.city;
	});

}

function redraw() {
	var t = d3.event.transform;
	t.x = Math.min(0, Math.max(mapWidth * (1-t.k), t.x));
	t.y = Math.min(0, Math.max(mapHeight * (1-t.k), t.y));
	gCountriesA.attr("transform", t);
	gCountriesB.attr("transform", t);
	focus.attr("transform", t)
	.attr("r", focusRadius/t.k)
	.attr("stroke-width", focusWidth/t.k)
	.attr("stroke-dasharray", focusWidth/t.k);
	//gRivers.attr("stroke-width", 1/t.k).attr("transform", t);
	gCities.attr("transform", t)
	.selectAll("g text").attr("font-size", cityFontSize/(0.3*t.k+0.7));
	d3.selectAll(".major circle")
	.attr("r", majorRadius/(0.3*t.k+0.7))
	.attr("stroke-width", majorWidth/(0.3*t.k+0.7));
	d3.selectAll(".major text").classed("hidden", scaleCutoff < t.k);
	d3.selectAll(".minor").classed("hidden", scaleCutoff > t.k);
	gCLabel.classed("hidden", true)
	.classed("inactive", scaleCutoff > t.k);
}