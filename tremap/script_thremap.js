window.onload = function () {
console.log('<<<<<three map start>>>>>>');

    var mainObject = {
        "name": "main",
        "children": []
    };
    var animation = false;
    var max = null;
    var maxFontSize = 20;
    var direction = -1;
    var tooltipDivHeight = 75;
    var tooltipDivWidth = 0;

    var color =  d3.scale.linear();//градієнт кольорів відносно величини


    var chart = d3.select('.chart');

    var tooltipDiv = chart.select('div.tooltip');


    var graph = {};
    graph.height = parseFloat(chart.style('height'));
    graph.width = parseFloat(chart.style('width'));

    var x = d3.scale.linear()
        .domain([0, graph.width])
        .range([0, graph.width]);

    var y = d3.scale.linear()
        .domain([0, graph.height])
        .range([0, graph.height]);

    var treemap = d3.layout.treemap()
        .children(function(d, depth) { return depth ? null : d._children; })
        //.sort(function(a,b) {
        //    if (a.value < b.value) return -1;
        //
        //    if (a.value > b.value) return 1;
        //
        //    return 0;
        //})
        .sort(function(a, b) { return  (a.value - b.value) * direction; })
        .ratio(graph.height / graph.width * 0.5 * (1 + Math.sqrt(5)))
        .round(false);

    d3.json("../data-json.csv", function(root) {
        findMinAndMax(root);
        console.log( max , color(max));
        mainObject.children = formattingData(root);
        console.log(mainObject.children[0], root[0]);
        mainObject.x = mainObject.y = 0;
        mainObject.dx = graph.width;
        mainObject.dy = graph.height;
        mainObject.depth = 0;
        console.log(root);

        draw(mainObject);
    });

    function findMinAndMax(array){
        var length = array.length;
        for (var i = 0; i < length ; i++ ){
            if( parseFloat(array[i][1]) > max){
                max = parseFloat(array[i][1]);
            }
        }
        color.domain([0, max]).range(['#FF0101', /*gradient*/ '#01FF2B']);
    }

    /**
     * @name formattingData
     *
     * @param {Array} array
     * @returns {Array}
     */
    function formattingData (array){
        var pasteIn = [];
        array.forEach(function(el, index, all){
            var object = {
                "name": el[0],
                "value": parseFloat(el[1])
            };

            pasteIn.push(object);

        });

        return pasteIn;
    }




    var svg = chart.append('svg')
        .attr('height', graph.height)
        .attr('width', graph.width).append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("shape-rendering", "crispEdges");

    function accumulate(d) {
        return (d._children = d.children)
            ? d.value = d.children.reduce(function(p, v) { return p + accumulate(v); }, 0)
            : d.value;
    }
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

        var g1 = svg.insert("g", ".grandparent")
            .datum(d)
            .attr("class", "depth");

        var g = g1.selectAll("g")
            .data(d._children)
            .enter().append("g");
/*
        g.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);
*/
        g.selectAll(".child")
            .data(function(d) { return d._children || [d]; })
            .enter()
            .append("rect")
            .attr("class", "child")
            .attr('fill', function (d){return color(d.value)})
            .call(rect);

        g.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function(d) { return d3.format(",d")(d.value); });

        /*
        g.append("text")
            .attr("dy", ".75em")
            .text(showText)
            .call(text);


        function showText(d){
            var height = y(d.y + d.dy) - y(d.y);
            if( height >  maxFontSize + 20){
                return d.name;
            } else {
                return '';
            }
        }
        */
        /*
        function transition(d) {
            if (animation || !d) return;
            animation = true;

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
                animation = false;
            });
        }
        */
    }

    function text(text) {
        text.attr("x", function(d) { return x(d.x) + 6; })
            .attr("y", function(d) { return y(d.y) + 6; })
            .attr('font-size', function (d){if( (y(d.y + d.dy) - y(d.y)) < maxFontSize){
                return (y(d.y + d.dy) - y(d.y));
            } else {return maxFontSize;}});
    }

    function rect(rect) {
        rect.attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y); })
            .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
            .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
            .on('mouseover', tooltipChangeData);

    }

    function draw(main){
        console.log('<<<< start draw >>>>>');
        accumulate(main);
        layout(main);
        console.log('<<<< start draw main>>>>>', main);
        display(main);


    }

    chart.on('mouseout', function(){tooltipDiv.style('display', 'none')});
    chart.on('mouseover', function(){tooltipDiv.style('display', 'block')});
    chart.on('mousemove', tooltip);




    function tooltipChangeData(d){
        //tooltip();
        var tooltipDiv = document.querySelectorAll('.chart div.tooltip')[0];
        tooltipDiv.querySelectorAll('.name')[0].innerHTML = d.name;
        tooltipDiv.querySelectorAll('.value')[0].innerHTML = d.value;
        //tooltipDivHeight = tooltipDiv[0][0].offsetHeight;
        // console.log(tooltipDiv.offsetHeight, tooltipDiv.innerHTML, tooltipDiv.querySelectorAll('.value')[0].offsetHeight);

        //console.log(d)
    }

    function tooltip(){
        console.log('fff', document.querySelectorAll('.chart div.tooltip')[0].offsetHeight);
        if(document.querySelectorAll('.chart div.tooltip')[0].offsetHeight > 0){
           // console.log('done');
            tooltipDivHeight = tooltipDiv[0][0].offsetHeight;
        }
        if(document.querySelectorAll('.chart div.tooltip')[0].offsetWidth > 0){

            tooltipDivWidth = tooltipDiv[0][0].offsetWidth;
        }

        var top = 0;
        var left = 0;

        if(d3.mouse(this)[1] < (tooltipDivHeight + 10) ){
            top = (d3.mouse(this)[1] + 20) + 'px';
        } else {
            top = (d3.mouse(this)[1] - tooltipDivHeight - 10) + 'px';
        }

        if(graph.width - d3.mouse(this)[0] < tooltipDivWidth){
            left = (d3.mouse(this)[0] - tooltipDivWidth + 10) + 'px';
        } else {
            left = d3.mouse(this)[0] + 'px';
        }
console.log(top, left)

        //console.log(tooltipDiv[0][0].offsetHeight);
        tooltipDiv.style('top', top).style('left', left);

    }


////---------------- перехід на порядок вище ---------
//    var mainParent = svg.append("g")
//        .attr("class", "mainParent");
//
//    mainParent.append("rect")
//        .attr("y", 0)
//        .attr("width", graph.width)
//        .attr("height", graph.height)
//        .append("text")
//        .attr("x", 6)
//        .attr("y", 6)
//        .attr("dy", ".75em");


};