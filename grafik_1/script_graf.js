
window.onload = function(){

    //------- settings block start ------
    var settings = {};
    settings.classesForCell = "treemap1";
    settings.mainBlock = document.querySelectorAll(".chart")[0];
    settings._mainBlockWidth = settings.mainBlock.offsetWidth;
    settings._mainBlockHeight = settings.mainBlock.offsetHeight;
    settings.colorMax = "#808000";
    settings.colorMin = "#000E8F";
    settings.myData = ["value", "done"];
    settings.deafaultMaximumForColor = 3000;
    settings.margin = {
        top : 20,
        right : 20,
        bottom : 20,
        left : 20
    };
    settings.transitioningTime = 700;

    var transitioning = false;
    var maxCount = NaN;
    var minCount = 0;
    var main = null;

    //------- settings block end ------

    //------- object prepear ----------
    function accumulate(object, value) {
        if ( object.children ){
            object._children = object.children
            return object[value] = object.children.reduce(function(p, v) { return p + accumulate(v, value); }, 0);
        } else {
            return object[value];
        };      
        
    }

    function accumulateAll(array, object){
        for (var i = 0; i < array.length; i++) {
            accumulate(object, array[i])
        }
        console.log( "compile done >>")
    }

    // coordinates. This lets us use a viewport to zoom.
    function layout(object) {
        if (object._children) {
              treemap.nodes({_children: object._children});
              
              object._children.forEach(function(c) {
                    c.x = object.x + c.x * object.dx;
                    c.y = object.y + c.y * object.dy;
                    c.dx *= object.dx;
                    c.dy *= object.dy;
                    c.parent = object;
                    layout(c);
              });
        }
    }

    function initialize(object) {
        console.log('>>>', object);
        object.x = object.y = 0;
        object.dx = settings._mainBlockWidth;
        object.dy = settings._mainBlockHeight;
        object.depth = 0;
    }

    //------- svg start ---------------
    var svg = d3.select(settings.mainBlock).append("svg")
        .attr("width", settings._mainBlockWidth)
        .attr("height", settings._mainBlockHeight);

    console.log( settings );


    var color =  d3.scale.linear()//градієнт кольорів відносно величини
        .domain([0, (settings.deafaultMaximumForColor || 1000)])
        .range([settings.colorMin , settings.colorMax ]);

    var x = d3.scale.linear()
        .domain([0, settings._mainBlockWidth])
        .range([0, settings._mainBlockWidth]);

    var y = d3.scale.linear()
        .domain([0, settings._mainBlockHeight])
        .range([0, settings._mainBlockHeight]);

    var treemap = d3.layout.treemap()
            .children(function(d, depth) { return depth ? null : d._children; })
            .size([settings._mainBlockWidth, settings._mainBlockHeight])
            .sort(function(a, b) { return a.value - b.value; })
            .round(false);

    function loadData( data ){
        initialize(data);//prepear data main block
        accumulateAll(settings.myData, data);//prepear data
        layout(data);//prepear data fo zoom
        console.log('>>>load done and data is >>>', data);
        showSvg(data)
        
    };

    d3.json("../data.json", loadData);

    function showSvg(data){
        var mainTreemap = treemap.nodes( data );
        console.log("done",  mainTreemap );

        main = svg.insert("g", ".grandparent")
            .datum(data)
            .attr("class", "depth");

        var cells = main.selectAll( "." + settings.classesForCell)
            .data( mainTreemap )
            .enter()
            .append("g")
            .attr("class", settings.classesForCell);
            

        cells.append("rect")
            .call(rect);

        cells.append("text")
            .call(text);

        cells.filter(function(d) { return d._children; })
            .classed("children", true)
            .on("click", transition);

        return cells;
    }

    function transition (data){
        console.log(data);

        if (transitioning || !data) return;
        showSvg(data)
        transitioning = true;
        var mainNew = showSvg(data);
        var beforeClick = main.transition().duration(750);
        var afterClick = mainNew.transition().duration(750);

        // Update the domain only after entering new elements.
        x.domain([data.x, data.x + data.dx]);
        y.domain([data.y, data.y + data.dy]);

        // Enable anti-aliasing during the transition.
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

        // Fade-in entering text.
        mainNew.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        beforeClick.selectAll("text").call(text).style("fill-opacity", 0);
        afterClick.selectAll("text").call(text).style("fill-opacity", 1);
        beforeClick.selectAll("rect").call(rect);
        afterClick.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        beforeClick.remove().each("end", function() {
            svg.style("shape-rendering", "crispEdges");
            transitioning = false;
        });
    }


    function text(text) {
        text.attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y ); })
            .attr("dy", 20)
            .text(function(d){return d.name;})
            .attr("fill", "#000");
    }

    function rect(rect) {
        rect.attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y); })
            .attr("width",function(d){return x(d.dx); })
            .attr("height",function(d){return y(d.dy); })
            .attr("fill", function(d){return d.done ? color(d.done) : null;})
            .attr("stroke", "#fff");
    }




};

