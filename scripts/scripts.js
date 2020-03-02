$(document).ready(function() {
  "use strict";
  var margin = { top: 60, right: 20, bottom: 40, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 365 - margin.top - margin.bottom;

  // Adjust parsing of data to properly show tooltip
  var parseDate = d3.timeParse("%b %Y"),
    bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left,
    formatValue = d3.format(".2"),
    formatCurrency = function(d) {
      return formatValue(d) + "%";
    };

  var minDate = new Date("2005,01");
  var maxDate = new Date("2019,12");

  var x = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom().scale(x);

  var yAxis = d3.axisLeft().scale(y);

  var line = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.rate);
    });

  var part1 = document.getElementById("part1");
  var svg = d3
    .select(part1)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Create Title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -25)
    .style("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "1.5em")
    .text("An Unemployment Graph");

  //Create X axis label
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .style("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "1.2em")
    .text("Year");

  //Create Y axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("font-size", "1.2em")
    .text("% Unemployed");

  d3.csv("unemployment_2005_2015.csv", function(error, data) {
    if (error) throw error;
    console.log(data);

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.rate = +d.rate;
    });

    y.domain(
      d3.extent(data, function(d) {
        return d.rate;
      })
    );

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Unemployment Rate (%)");

    // Start Animation on Click
    d3.select("#start").on("click", function() {
      var path = svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      // Variable to Hold Total Length
      var totalLength = path.node().getTotalLength();

      // Set Properties of Dash Array and Dash Offset and initiate Transition
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Call Transition Method
        .duration(4000) // Set Duration timing (ms)
        .ease(d3.easeLinear) // Set Easing option
        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

      // Create SVG for Tooltip and Circle on Mouseover
      var focus = svg
        .append("g")
        .attr("class", "focus")
        .style("display", "none");

      // Append a circle to show on Mouseover
      focus.append("circle").attr("r", 4.5);

      // Append text to show on Mouseover
      focus
        .append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      // Append overlay rectangle as container for Circle and Tooltips
      // that allows user to hover anywhere on graphic
      svg
        .append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() {
          focus.style("display", null);
        })
        .on("mouseout", function() {
          focus.style("display", "none");
        })
        .on("mousemove", mousemove);

      // Mousemove function that sets location and changes properties of Focus SVG
      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.rate) + ")");
        focus.attr("font-weight", "bold");
        focus.attr("font-size", "1.2em");
        focus.select("text").text(formatCurrency(d.rate));
      }
    });

    // Reset Animation
    d3.select("#reset").on("click", function() {
      d3.select(".line").remove();
    });
  });
});

$(document).ready(function() {
  var margin = { top: 10, right: 40, bottom: 100, left: 25 },
    margin2 = { top: 330, right: 40, bottom: 30, left: 25 },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    height2 = 400 - margin2.top - margin2.bottom;

  var svg = d3
    .select(part2)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var parseDate = d3.timeParse("%b %Y"),
    bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left,
    formatValue = d3.format(".2"),
    formatCurrency = function(d) {
      return formatValue(d) + "%";
    };

  var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

  var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

  var brush = d3
    .brushX()
    .extent([
      [0, 0],
      [width, height2]
    ])
    .on("brush end", brushed);

  var zoom = d3
    .zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([
      [0, 0],
      [width, height]
    ])
    .extent([
      [0, 0],
      [width, height]
    ])
    .on("zoom", zoomed);

  var area = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x(function(d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
      return y(d.rate);
    });

  var area2 = d3
    .area()
    .curve(d3.curveMonotoneX)
    .x(function(d) {
      return x2(d.date);
    })
    .y0(height2)
    .y1(function(d) {
      return y2(d.rate);
    });

  svg
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var focus = svg
    .append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var context = svg
    .append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  d3.csv("unemployment_2005_2015.csv", type, function(error, data) {
    if (error) throw error;

    x.domain(
      d3.extent(data, function(d) {
        return d.date;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.rate;
      })
    ]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    focus
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    focus
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    focus
      .append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

    context
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

    context
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    context
      .append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

    svg
      .append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
    //   .on("mouseover", function() {
    //     focus2.style("display", null);
    //   })
    //   .on("mouseout", function() {
    //     focus2.style("display", "none");
    //   })
    //   .on("mousemove", mousemove);

    // // Create SVG for Tooltip and Circle on Mouseover
    // var focus2 = svg
    //   .append("g")
    //   .attr("class", "focus")
    //   .style("display", "none");

    // // Append a circle to show on Mouseover
    // focus2.append("circle").attr("r", 4.5);

    // // Append text to show on Mouseover
    // focus2
    //   .append("text")
    //   .attr("x", 9)
    //   .attr("dy", ".35em");

    // // Mousemove function that sets location and changes properties of Focus SVG
    // function mousemove() {
    //   var x0 = x.invert(d3.mouse(this)[0]),
    //     i = bisectDate(data, x0, 1),
    //     d0 = data[i - 1],
    //     d1 = data[i],
    //     d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   focus2.attr("transform", "translate(" + x(d.date) + "," + y(d.rate) + ")");

    //   focus2.select("text").text(formatCurrency(d.rate));
    // }
  });

  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(width / (s[1] - s[0])).translate(-s[0], 0));
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
  }

  function type(d) {
    d.date = parseDate(d.date);
    d.rate = +d.rate;
    return d;
  }
});
