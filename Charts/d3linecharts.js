var w = 900,
    h = 450;

var facingNames = [ "","backstage", "stageleft", "audience", "stageright","" ];

var maxDataPointsForDots = 50,
	transitionDuration = 1000;

var svg = null,
	yAxisGroup = null,
	xAxisGroup = null,
	dataCirclesGroup = null,
	dataLinesGroup = null;

function draw(data, num) {
	//var data = generateData();
	svg = null;
	yAxisGroup = null;
	xAxisGroup = null;
	dataCirclesGroup = null;
	dataLinesGroup = null;
	var margin = 40;
	var max = d3.max(data, function(d) { return d.time });
	var min = 0;
	var pointRadius = 4;
	var y = d3.time.scale().range([h - margin * 2,0]).domain([-1,4]);// -2,9 for doing viewing grids
	var x = d3.scale.linear().range([0, w - margin * 2]).domain([min, max]);

	var xAxis = d3.svg.axis().scale(x).tickSize(h - margin * 2).tickPadding(10).ticks(14);
	var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-w + margin * 2).tickPadding(10);//.tickValues([facingNames]).tickFormat(function(i) {return facingNames[i];});
	//var t = null;

	svg = d3.select('#chart').select('svg').select('g');
	if (svg.empty()) {
		svg = d3.select('#chart')
			.append('svg:svg')
				.attr('width', w)
				.attr('height', h)
				.attr('class', 'viz')
			.append('svg:g')
				.attr('transform', 'translate(' + margin + ',' + margin + ')');
	}

	//t = svg.transition().duration(transitionDuration);

	// y ticks and labels
	if (!yAxisGroup) {
		yAxisGroup = svg.append('svg:g')
			.attr('class', 'yTick')
			.call(yAxis);
	}
	else {
		//t.select('.yTick').call(yAxis);
	}

	// x ticks and labels
	if (!xAxisGroup) {
		xAxisGroup = svg.append('svg:g')
			.attr('class', 'xTick')
			.call(xAxis);
	}
	else {
		//t.select('.xTick').call(xAxis);
	}

	// Draw the lines
	if (!dataLinesGroup) {
		dataLinesGroup = svg.append('svg:g');
	}

	var dataLines = dataLinesGroup.selectAll('.data-line')
			.data([data]);

	var line = d3.svg.line()
		// assign the X function to plot our line as we wish
		.x(function(d,i) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting X value for date: ' + d.date + ' using index: ' + i + ' to be at: ' + x(d.date) + ' using our xScale.');
			// return the X coordinate where we want to plot this datapoint
			//return x(i); 
			return x(d.time); 
		})
		.y(function(d) { 
			// verbose logging to show what's actually being done
			//console.log('Plotting Y value for data value: ' + d.value + ' to be at: ' + y(d.value) + " using our yScale.");
			// return the Y coordinate where we want to plot this datapoint
			//return y(d); 
			return y(d.value+.1*((num == 0)?(1):(-1))); 
		})
		.interpolate("linear");

		 /*
		 .attr("d", d3.svg.line()
		 .x(function(d) { return x(d.date); })
		 .y(function(d) { return y(0); }))
		 .transition()
		 .delay(transitionDuration / 2)
		 .duration(transitionDuration)
			.style('opacity', 1)
                        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.value) + ")"; });
		  */

	var garea = d3.svg.area()
		.interpolate("linear")
		.x(function(d) { 
			// verbose logging to show what's actually being done
			return x(d.time); 
		})
            	.y0(h - margin * 2)
		.y1(function(d) { 
			// verbose logging to show what's actually being done
			return y(d.value); 
		});

	//dataLines
	//	.enter()
	//	.append('svg:path')
     //       	.attr("class", "area")
     //       	.attr("d", garea(data));

	dataLines.enter().append('path')
		 .attr('class', 'data-line')
		 .style('opacity', 0.3)
		 .style('stroke', function(d) { if (num==0) {return "steelblue";} else {return "red";}})
		 .attr("d", line(data));
		/*
		.transition()
		.delay(transitionDuration / 2)
		.duration(transitionDuration)
			.style('opacity', 1)
			.attr('x1', function(d, i) { return (i > 0) ? xScale(data[i - 1].date) : xScale(d.date); })
			.attr('y1', function(d, i) { return (i > 0) ? yScale(data[i - 1].value) : yScale(d.value); })
			.attr('x2', function(d) { return xScale(d.date); })
			.attr('y2', function(d) { return yScale(d.value); });
		*/

	//dataLines.transition()
	//	.attr("d", line)
	//	.duration(transitionDuration)
	//		.style('opacity', 1)
      //                  .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(d.value) + ")"; });

	dataLines.exit()
		//.transition()
	//	.attr("d", line)
	//	.duration(transitionDuration)
      //                  .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(0) + ")"; })
		//	.style('opacity', 1e-6)
			.remove();

	//d3.selectAll(".area").transition()
	//	.duration(transitionDuration)
	//	.attr("d", garea(data));

	
}
function getAllData(folder) {
	d3.selectAll(".viz").remove();
	if(folder == null || folder == "") {
		folder = "HAMLET";
	}
	var listoffiles = ["ruleslogs/", "bmllogs/"];
	for(var i = 0; i < listoffiles.length; i++) {
		console.log("generating data for "+listoffiles[i]+folder+".csv");
		generateData(listoffiles[i] + folder + ".csv", i);
	}
	
}

function generateData(filename, num) {
	
	if(filename == null || filename == "") {
		filename = "ruleslogs/HAMLET.csv";
	}
	console.log("getting file "+filename);
	var data = d3.csv(filename, function(postns) {
		var retpostns = [];
		var i = 0;
		var prior = null;
		
		postns.forEach(function(d) {

			d.time = new Date((+d.newtime));
			//d.x = +d.newtime;
			d.rot = d.rotation;
			switch(d.rotation) {
				case "audience":
					d.value = 2;
					break;
				case "backstage":
					d.value = 0;
					break;
				case "stageright":
					d.value = 1;
					break;
				case "stageleft":
					d.value = 3;
					break;
				default:
					d.value = -1;
					break;
			}

//d.value = +d.cell; // this will plot the 9 cells
			//d.rot = 360 - (+d.rot) * 180 / Math.PI;

			if(i % 30 == 0) {

				retpostns.push(d);
			}
			i++;
			prior = d;

		});

		retpostns.push(prior);

		draw(retpostns, num);
		
	});
}


getAllData(d3.select('#text').property("value"));
