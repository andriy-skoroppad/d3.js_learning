
window.onload = function(){

    //------- settings block start ------
    var settings = {};
    settings.showChildren = false;
    settings.classesForCell = "child";
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
    settings._heigth = settings._mainBlockHeight - settings.margin.top - settings.margin.bottom;
    settings._width = settings._mainBlockWidth - settings.margin.left - settings.margin.right;

    var transitioning = false;
    var maxCount = NaN;
    var minCount = 0;
    // var main = null;


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
        object.dx = settings._width;
        object.dy = settings._heigth;
        object.depth = 0;
    }

    //------- svg settings start ---------------
    // var treemap = d3.layout.treemap()
    //         .children(function(d, depth) { return depth ? null : d._children; })
    //         .size([settings._mainBlockWidth, settings._mainBlockHeight])
    //         .sort(function(a, b) { return a.value - b.value; })
    //         .round(false);

    var treemap = d3.layout.treemap()
    .children(function(d, depth) { return depth ? null : d._children; })
    .sort(function(a, b) { return a.value - b.value; })
    .ratio(settings._heigth / settings._width * 0.5 * (1 + Math.sqrt(5)))
    .round(false);

    var color =  d3.scale.linear()//градієнт кольорів відносно величини
        .domain([0, (settings.deafaultMaximumForColor || 1000)])
        .range([settings.colorMin , settings.colorMax ]);

    var x = d3.scale.linear()
        .domain([0, settings._width])
        .range([0, settings._width]);

    var y = d3.scale.linear()
        .domain([0, settings._heigth])
        .range([0, settings._heigth]);

    //----- svg start ---------------------
    var svg = d3.select( settings.mainBlock ).append("svg")
        .attr("width", settings._mainBlockWidth)
        .attr("height", settings._mainBlockHeight)
        .attr("viewBox","0 0 " + settings._mainBlockWidth + " " +  settings._mainBlockHeight)
        .append("g")
        .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")")
        .style("shape-rendering", "crispEdges");
    
    var grandparent = svg.append("g")
        .attr("class", "grandparent");

    grandparent.append("rect")
        .attr("y", -settings.margin.top)
        .attr("width", settings._mainBlockWidth)
        .attr("height", settings.margin.top);

    grandparent.append("text")
        .attr("x", 6)
        .attr("y", 6 - settings.margin.top)
        .attr("dy", ".75em")
        .attr("fill", "red");

    var treemapCanvas = svg.insert("g", ".grandparent")
            .attr("height", settings._heigth)
            .attr("width", settings._width)
            /*.append("svg")
            .attr("height", settings._heigth)
            .attr("width", settings._width)*/;


    d3.json("../data.json", loadData);

    function loadData( data ){
        initialize(data);//prepear data main block
        accumulateAll(settings.myData, data);//prepear data
        layout(data);//coordinates. This lets us use a viewport to zoom.
        
        showSvg(data);//start visualisation 
        
    };

    

    function showSvg(data){
        
        console.log("done",  data );

        grandparent
            .datum(data.parent)
            .on("click", transition)
            .select("text")
            .text(name(data));

        var main = treemapCanvas.append("g")
            .datum(data)
            .attr("class", "depth");

        var children = main.selectAll("g")
            .data(data._children)
            .enter()
            .append("g");

        children.filter(function(d){ return d._children})
            .classed("children", true)
            .on("click", transition);

        if(settings.showChildren){
            children.selectAll("." + settings.classesForCell)
                .data(function(d){return d._children || [d];})
                .enter()
                .append("rect")
                .attr("class", settings.classesForCell)
                .call(rect);
        };

        children.append("rect")
            .attr("class", "parent")
            .call(rect)
            .append("title")
            .text(function(d){ return d3.format(",d")(d.value); })
        
        children.append("text")
            .attr("dy", ".75em")
            .text(function(d){return d.name; })
            .call(text);


        function transition (data){

            if (transitioning || !data) return;
            transitioning = true;
            
            var mainNew = showSvg(data);
            var beforeClick = main.transition().duration(750);
            var afterClick = mainNew.transition().duration(750);

            // Update the domain only after entering new elements.

            console.log([data.x, data.x + data.dx], [data.y, data.y + data.dy]);
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


        return children;
    }

    


    function text(text) {
        text.attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y); })
            .attr("dy", 20)
            .text(function(d){return d.name;})
            .attr("fill", "#000");
    }

    function rect(rect) {
        rect.attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y); })
            .attr("width",function(d){return x(d.x + d.dx) - x(d.x); })
            .attr("height",function(d){return y(d.y + d.dy) - y(d.y); })
            .attr("fill", function(d){return d.done ? color(d.done) : null;})
            .attr("stroke", "#fff");
    }

    function name(data) {
        if(data.parent){
            return (name(data.parent)? name(data.parent)+ " > " : "" )+ data.name;
        } else {
            return "";
        }
      }


};

