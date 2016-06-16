window.onload = function () {
// 	console.log('<<<<<path start>>>>>>')

// 	var svg = d3.select('body')
// 				.append('svg')
// 				.attr('height', 300)
// 				.attr('width', 400);

// 	var dataForGrafic= [
// 		{x:10, y: 50},
// 		{x:20, y: 55},
// 		{x:30, y: 90},
// 		{x:40, y: 60},
// 		{x:50, y: 90},
// 		{x:60, y: 60},
// 		{x:70, y: 90},
// 		{x:80, y: 60},
// 		{x:90, y: 90},
// 		{x:100, y: 60},
// 		{x:110, y: 90},
// 		{x:120, y: 0}
// 	];

// 	var group = svg.append('g')
// 				.attr('transform', 'translate( 10, 10)');
// 	var line = d3.svg.line()
// 				.x(function(d){ return d.x * 2; })
// 				.y(function(d){ return d.y * 2; })
// 	group.selectAll('path')
// 				.data([dataForGrafic])//[]потрібні тому що лінія має бути одна
// 				.enter()
// 				.append('path')//створення фігури
// 				.attr('d', line)//функція line створює сама кординати
// 				.attr('fill', 'none')//забираєм задній фон bacgroung?
// 				.attr('stroke', '#000')
// 				.attr('stroke-width', '3');

// 	//----chart simple----проста забита вручну дуга

	
// 	var r = 50;
// 	var p = Math.PI * 2;
// 	var svgForCharts = d3.select('body')
// 				.append('svg')
// 				.attr('height', 300)
// 				.attr('width', 400)
// 				.append('g')
// 				.attr('transform', 'translate(' + r * 2 + ',' + r * 2 + ')');
	
// 	var arc = d3.svg.arc()
// 				.innerRadius(r - 30)
// 				.outerRadius(r)
// 				.startAngle(0)
// 				.endAngle( p / 1.8 );

// 	svgForCharts.append('path')
// 				.attr('d', arc)
// 				.attr('fill', 'red')
// 				.attr('stroke', '#000')
// 				.transition().duration(1000)
// 				.attr('fill', '#0000FF');
// 	//--------normal chart -----------------------
// 	var dataForNormalChart = [10, 50, 70];
// 	var radius = 100;

// 	var colorOfChartParts = d3.scale.ordinal()//попорядку задає колір
// 				.range(['#C1C350', '#5BC34F', '#5D67C3']);

// 	var canvas = d3.select('body').append('svg')
// 				.attr('width', 300)
// 				.attr('height', 300)
// 	var groupElements = canvas.append('g')
// 				.attr('transform', 'translate(100, 100)');
// 	var arcN = d3.svg.arc()//створення кола
// 				.innerRadius(50)
// 				.outerRadius(radius);

// 	var pie = d3.layout.pie()//фенкція яка правильно форматує дані
// 				.value(function(d){return d;})

// 	var arcs = groupElements.selectAll('.arc')
// 				.data( pie(dataForNormalChart) )// відформатовані дані
// 				.enter()
// 				.append('g')
// 				.attr('class', 'arc');

// 	arcs.append('path')
// 				.attr('d', arcN)//створення 
// 				.attr('fill', function(d){return colorOfChartParts(d.data); }); //заливка відповідним кольором
// 	arcs.append('text')
// 				.text(function(d){ return d.data; })//всавляє текст в даному випадку число відповідне
// 				.attr('transform', function(d){ return 'translate(' + arcN.centroid(d) + ')'})//переміщає текст по середині дуги
// 				.attr('text-anchor', 'middle')//вирівює текст


var margin = {top: 20, right: 0, bottom: 0, left: 0},
    width = 960,
    height = 500 - margin.top - margin.bottom,
    formatNumber = d3.format(",d"),
    transitioning;

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([0, height]);

var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d._children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .style("margin-left", -margin.left + "px")
    .style("margin.right", -margin.right + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("shape-rendering", "crispEdges");

var grandparent = svg.append("g")
    .attr("class", "grandparent");

grandparent.append("rect")
    .attr("y", -margin.top)
    .attr("width", width)
    .attr("height", margin.top);

grandparent.append("text")
    .attr("x", 6)
    .attr("y", 6 - margin.top)
    .attr("dy", ".75em");

d3.json("flare.json", function(root) {
  initialize(root);
  accumulate(root);
  layout(root);
  display(root);

  function initialize(root) {
    root.x = root.y = 0;
    root.dx = width;
    root.dy = height;
    root.depth = 0;
      console.log(root)
  }

  // Aggregate the values for internal nodes. This is normally done by the
  // treemap layout, but not here because of our custom implementation.
  // We also take a snapshot of the original children (_children) to avoid
  // the children being overwritten when when layout is computed.
  function accumulate(d) {
    return (d._children = d.children)
        ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
        : d.value;
  }

  // Compute the treemap layout recursively such that each group of siblings
  // uses the same size (1×1) rather than the dimensions of the parent cell.
  // This optimizes the layout for the current zoom state. Note that a wrapper
  // object is created for the parent node for each group of siblings so that
  // the parent’s dimensions are not discarded as we recurse. Since each group
  // of sibling was laid out in 1×1, we must rescale to fit using absolute
  // coordinates. This lets us use a viewport to zoom.
  function layout(d) {
    if (d._children) {
      treemap.nodes({_children: d._children});
      d._children.forEach(function(c) {
        c.x = d.x + c.x * d.dx;
        c.y = d.y + c.y * d.dy;
        c.dx *= d.dx;
        c.dy *= d.dy;
        c.parent = d;
        layout(c);
      });
    }
  }

  function display(d) {
    grandparent
        .datum(d.parent)
        .on("click", transition)
      .select("text")
        .text(name(d));

    var g1 = svg.insert("g", ".grandparent")
        .datum(d)
        .attr("class", "depth");

    var g = g1.selectAll("g")
        .data(d._children)
      .enter().append("g");

    g.filter(function(d) { return d._children; })
        .classed("children", true)
        .on("click", transition);

    g.selectAll(".child")
        .data(function(d) { return d._children || [d]; })
      .enter().append("rect")
        .attr("class", "child")
        .call(rect);

    g.append("rect")
        .attr("class", "parent")
        .call(rect)
      .append("title")
        .text(function(d) { return formatNumber(d.value); });

    g.append("text")
        .attr("dy", ".75em")
        .text(function(d) { return d.name; })
        .call(text);

    function transition(d) {
      if (transitioning || !d) return;
      transitioning = true;

      var g2 = display(d),
          t1 = g1.transition().duration(750),
          t2 = g2.transition().duration(750);

      // Update the domain only after entering new elements.
      x.domain([d.x, d.x + d.dx]);
      y.domain([d.y, d.y + d.dy]);

      // Enable anti-aliasing during the transition.
      svg.style("shape-rendering", null);

      // Draw child nodes on top of parent nodes.
      svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

      // Fade-in entering text.
      g2.selectAll("text").style("fill-opacity", 0);

      // Transition to the new view.
      t1.selectAll("text").call(text).style("fill-opacity", 0);
      t2.selectAll("text").call(text).style("fill-opacity", 1);
      t1.selectAll("rect").call(rect);
      t2.selectAll("rect").call(rect);

      // Remove the old node when the transition is finished.
      t1.remove().each("end", function() {
        svg.style("shape-rendering", "crispEdges");
        transitioning = false;
      });
    }

    return g;
  }

  function text(text) {
    text.attr("x", function(d) { return x(d.x) + 6; })
        .attr("y", function(d) { return y(d.y) + 6; });
  }

  function rect(rect) {
    rect.attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
        .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); });
  }

  function name(d) {
    return d.parent
        ? name(d.parent) + "." + d.name
        : d.name;
  }
});

}