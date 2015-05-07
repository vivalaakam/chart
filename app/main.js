require(['d3'], function(d3) {
  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

  var parseDate = d3.time.format("%d.%m.%Y").parse;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(Math.max(height / 25, 2)).tickSize(-width);

  var yGrid = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(Math.max(height / 25, 2))
    .tickSize(-width, 0, 0)
    .tickFormat("");

  var line = d3.svg.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.USD);
    });

  var chart = document.querySelector('#chart');
  var originalY = 0;


  var container = d3.select(chart).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var svg = container
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  var resizer = svg.append("rect")
    .attr("class", "resizer")
    .attr("width", 50)
    .attr("transform", "translate(" + width / 2 + ",-20)")
    .attr("height", 10);



  d3.json("data.json", function(error, data) {
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.USD = +d.USD ;
      d.EUR = +d.EUR ;
      d.GBR = +d.GBR ;
    });

    x.domain(d3.extent(data, function(d) {
      return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
      return d.USD;
    }));

    var xA = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


    var yA = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    yA.selectAll("g").filter(function(d) {
        return d;
      })
      .classed("minor", true);


    svg.append("g")
      .attr("class", "grid")
      .call(yGrid);

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
      svg.attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");
      xA.attr("transform", "translate(0," + height + ")");

      svg.selectAll('path.line').attr("d", line);
      svg.selectAll('g.y.axis').call(yAxis.ticks(Math.max(height / 25, 2)));
      svg.selectAll("g.y.axis g").filter(function(d) {
          return d;
        })
        .classed("minor", true);
    }

    resizer.on('mousedown', mouseDown);

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);


  });
});
