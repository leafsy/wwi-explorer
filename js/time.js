var timeWidth = mapWidth;
var descWidth = 300;
var descMargin = 10;
var descPadding = 15;
var timeHeight = 160;
var timeLength = timeWidth*20;
var duration = [new Date("1914-01-01"), new Date("1919-12-31")];
var timeX = timeWidth/2;
var timeY = 100;
var limits = [-700, -timeLength+1500];
var timePos = [limits[0], timeY];
var topMargin = 20;
var botMargin = 20;
var slots = [-60,-44,-28,-12];
var markerRadius = 2.5;
var lineSlant = [8,8]
var initDesc = { title: "Timeline of the Great War - major events and battles",
			     date: "June 1914 - June 1919"};

var drag = d3.drag()
.on("drag", dragged);

var timeScale = d3.scaleTime()
.domain(duration)
.range([0,timeLength]);

var moveScale = d3.scaleTime()
.domain([timeX, timeX-timeLength])
.range(duration);
function getTime() {
	return moveScale(timePos[0]);
}

var dial, year, gTimeline, gEvents;
var desc, gDesc, descLine1, descLine2;

function showTime() {

	dial = d3.select("#dial")
	.attr("width", timeWidth+descWidth)
	.attr("height", timeHeight)
	.call(drag)
	.call(d3.zoom().on("zoom", zoomed));

	drawBackground();

	var current = dial.append("g")
	.attr("id", "currentMarker")
	.attr("transform", "translate(0.5,0)");
	current.append("line")
	.attr("id", "currentLine")
	.attr("x1", timeX).attr("x2", timeX)
	.attr("y1", topMargin).attr("y2", timeY);
	current.append("path")
	.attr("d", "M0 5 L4 0 L-4 0 Z")
	.attr("transform", "translate("+[timeX,topMargin]+")");

	timeAxis = d3.axisBottom(timeScale)
	.ticks(d3.timeMonth.every(1))
	.tickFormat(d3.timeFormat("%B"));
	gTimeline = dial.append("g")
	.attr("transform", "translate("+timePos+")")
	gTimeline.append("g")
	.attr("id", "timeAxis")
	.call(timeAxis);

	year = dial.append("text")
	.attr("id", "yearLabel")
	.attr("x", timeX-20)
	.attr("y", timeHeight-botMargin)
	.text(getTime().getFullYear());

	drawEvents();
	drawDesc();

}

function drawBackground() {

	var bkgrd = dial.append("g")
	.attr("id", "timeBkgrd")
	bkgrd.append("rect")
	.attr("x", 0)
	.attr("y", topMargin)
	.attr("width", timeWidth+descWidth)
	.attr("height", timeY-topMargin);

	var lines = bkgrd.selectAll("line").data(slots);
	lines.enter()
	.append("line")
	.merge(lines)
	.attr("x1", 0).attr("x2", timeWidth+descWidth)
	.attr("y1", function(d) { return timeY+d; })
	.attr("y2", function(d) { return timeY+d; });

}

function drawEvents() {

	gEvents = gTimeline.append("g").attr("class", "events");

	var mouseover = function(d) {
		d3.select(this).transition().duration(100)
		.attr("r", markerRadius*1.4);
		d3.selectAll("circle.hover").classed("hover", false);
		d3.select(this).classed("hover", true);
		gDesc.select("rect").classed("event", true);

		desc.select("h3").text(d.name);
		desc.select("p").text(d.date.getMonth()+1 + '/' +
							  d.date.getDate() + '/' +
							  d.date.getFullYear());

		var x = Number(d3.select(this).attr("cx")) + timePos[0];
		descLine1.classed("hidden", false)
		.attr("transform", "translate("+[x,slots[d.position]]+")");
		descLine2.classed("hidden", false)
		.attr("x1", x+lineSlant[0])
		.attr("transform", "translate("+[0,slots[d.position]]+")");
	}
	var mouseout = function(d) {
		if (!closeInTime(d.date, getTime())) {
			d3.select(this).transition().duration(100)
			.attr("r", markerRadius);
			d3.select(this).classed("hover", false);
			gDesc.select("rect").classed("event", false);
			descLine1.classed("hidden", true);
			descLine2.classed("hidden", true);
			desc.select("h3").text(initDesc.title);
			desc.select("p").text(initDesc.date);
		}
	}
	var mouseclick = function(d) {
		timePos[0] = timeX-timeScale(d.date);
		updateTime(50);
		focus.classed("hidden", false)
		.attr("cx", projection([d.lng, d.lat])[0])
		.attr("cy", projection([d.lng, d.lat])[1]);
		d3.select(this).each(d3.select(this).on("mouseover"));
	}

	var markers = gEvents.selectAll("circle").data(events);
	markers.enter()
	.append("circle")
	.merge(markers)
	.attr("cx", function(d) {
		return timeScale(d.date);
	})
	.attr("cy", function(d) {
		return slots[d.position];
	})
	.attr("r", markerRadius)
	.on("mouseover", mouseover)
	.on("mouseout", mouseout)
	.on("click", mouseclick);

}

function drawDesc() {

	gDesc = dial.append("g")
	.attr("id", "eventDesc");
	gDesc.append("rect")
	.attr("x", timeWidth+descMargin)
	.attr("y", 0)
	.attr("width", descWidth-2*descMargin)
	.attr("height", timeY-descMargin);

	desc = gDesc.append("foreignObject")
	.attr("x", timeWidth+descMargin+descPadding)
	.attr("y", descPadding)
	.attr("width", descWidth-2*descMargin-2*descPadding)
	.attr("height", timeY-descMargin-2*descPadding);
	desc.append("xhtml:h3")
	.attr("xmln", "http://www.w3.org/1999/xhtml")
	.text(initDesc.title);
	desc.append("xhtml:p")
	.attr("xmln", "http://www.w3.org/1999/xhtml")
	.text(initDesc.date);

	descLine1 = gDesc.append("line")
	.attr("class", "hidden")
	.attr("x1", markerRadius).attr("x2", lineSlant[0])
	.attr("y1", timeY-markerRadius).attr("y2", timeY-lineSlant[1]);
	descLine2 = gDesc.append("line")
	.attr("class", "hidden")
	.attr("x1", 0).attr("x2", timeWidth+descMargin)
	.attr("y1", timeY-lineSlant[1]).attr("y2", timeY-lineSlant[1]);

}

function dragged(d) {
	timePos[0] = Math.min(limits[0], 
				 Math.max(limits[1], timePos[0]+d3.event.dx));
	updateTime(0);
}

var prevk = 1;
function zoomed() {
	var tk = d3.event.transform.k;
	timePos[0] = Math.min(limits[0], 
				 Math.max(limits[1], timePos[0]+(tk>prevk? 100:-100)));
	updateTime(50);
	prevk = tk;
}

function closeInTime(t1, t2) {
	var timeDiff = Math.abs(t1.getTime() - t2.getTime());
	return timeDiff < 1000*3600*24*7;
}

function updateTime(duration) {

	var time = getTime();
	gTimeline.transition().duration(duration)
	.attr("transform", "translate("+timePos+")");

	var flag = false;
	gEvents.selectAll("circle")
	.each(function(d) {
		if (closeInTime(d.date, time)) {
			d3.selectAll("circle.hover").classed("hover", false);
			d3.select(this).each(d3.select(this).on("mouseover"));
			flag = true;
		} else {
			d3.select(this).transition().duration(100)
			.attr("r", markerRadius);
			d3.select(this).classed("hover", false);
		}
		if (!flag) {
			descLine1.classed("hidden", true);
			descLine2.classed("hidden", true);
			gDesc.select("rect").classed("event", false);
			desc.select("h3").text(initDesc.title);
			desc.select("p").text(initDesc.date);
		}
	});
	year.text(time.getFullYear());

	gCountriesB.selectAll("path")
	.attr("class", function(d) {
		d = d.properties;
		for (var i = d.dates.length-1; i >= 0; i--) {
			if (d.dates[i] <= time) return d.status[i];
		}
	});

	gFronts.selectAll("g").selectAll("path")
	.classed("hidden", function(d) {
		if (time >= d.properties.date) {
			d3.select(this.parentNode).selectAll("path")
			.classed("hidden", true);
			return false;
		}
		return true;
	});

}