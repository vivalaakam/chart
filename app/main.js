require(['d3'], function(d3) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 110,
      left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom,
    margin2 = {
      top: 480,
      right: 20,
      bottom: 50,
      left: 50
    },
    width2 = 960 - margin.left - margin.right,
    height2 = 550 - margin2.top - margin2.bottom;

  var parseDate = d3.time.format("%d.%m.%Y").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var x2 = d3.time.scale()
    .range([0, width]);

  var y2 = d3.scale.linear()
    .range([height2, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(Math.max(height / 25, 2)).tickSize(-width);

  var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");


  var chart = document.querySelector('#chart');
  var originalY = 0;


  var container = d3.select(chart).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var svg = container
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);


  var line = d3.svg.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.USD);
    });


  var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {
      return x2(d.date);
    })
    .y0(height2)
    .y1(function(d) {
      return y2(d.USD);
    });
  var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var resizer = focus.append("rect")
    .attr("class", "resizer")
    .attr("width", 50)
    .attr("transform", "translate(" + width / 2 + ",-20)")
    .attr("height", 10);

  var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  d3.json("data.json", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.USD = +d.USD;
      d.EUR = +d.EUR;
      d.GBR = +d.GBR;
    });

    var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
      return d.USD;
    }));

    x2.domain(x.domain());
    //y2.domain(y.domain());

    focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    focus.selectAll("g").filter(function(d) {
        return d;
      })
      .classed("minor", true);

    context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

    context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

    context.append("g")
      .attr("class", "x brush")
      .call(brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);

    function mouseDown(e) {
      container.on('mouseup', mouseUp);
      container.on('mousemove', mouseDrag);
      originalY = d3.event.y;
    }

    function mouseUp() {
      container.on('mousemove', null);
    }

    function mouseDrag() {
      var delta = d3.event.y - originalY;
      margin.top = margin.top + delta;
      height = height - delta;

      originalY = d3.event.y;
      y.range([height, 0]);
      svg.attr("height", height);
      focus.attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");
      svg.selectAll('path.line').attr("d", line);
      focus.selectAll('g.x.axis').attr("transform", "translate(0," + height + ")");
      focus.selectAll('g.y.axis').call(yAxis.ticks(Math.max(height / 25, 2)));
      focus.selectAll("g.y.axis g").filter(function(d) {
          return d;
        })
        .classed("minor", true);
    }

    resizer.on('mousedown', mouseDown);

    focus.append("path")
      .datum(data)
      .attr("clip-path", "url(#clip)")
      .attr("class", "line")
      .attr("d", line);

    function brushed() {
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      focus.select(".line").attr("d", line);
      focus.select(".x.axis").call(xAxis);
      var extent = brush.extent();
    }
  });
});
