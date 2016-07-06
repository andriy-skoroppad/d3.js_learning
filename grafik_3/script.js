var color =  d3.scaleLinear()//градієнт кольорів відносно величини
    .domain([0, 10000])
    .range(["#7fffd4" , "#2a3c01" ]);

var x = d3.scaleLinear()
    .domain([0, 400])
    .range([0, 400]);

var y = d3.scaleLinear()
    .domain([0, 400])
    .range([0, 400]);


window.onload = function(){




    var  nodes = d3.treemap()
            .size([400, 400])
            .round(false);

    


    d3.json("../data.json", loadData);

    var element = document.querySelector(".chart");

    var canvasForTreemap = d3.select(element).style("overflow", "hidden");

    var svgForTreemap =  canvasForTreemap.append("svg")
        .attr("height", 400)
        .attr("width", 400);

    function loadData(data){
        //initialize(data);

        accumulateAll(["value", "done"], data);

        //layout(data);
        var newData = treematStart(data);
        console.log(newData);

         var main = svgForTreemap.append("g")
             .datum(newData)
             .attr("class", "depth");

         var children = main.selectAll("g")
             .data(newData)
             .enter()
             .append("g");

         children.filter(function(d){ return !d.children})
             .classed("children", true)
             .on("click", transition);

         children.append("rect")
             .attr("class", "parent")
             .call(rect)
             .append("title")
             .text(function(d){ return d3.format(",d")(d.value); });


        function transition(data){
            console.log("data",data);
            console.log(data.data);


            //console.log(x(data.x1) - x(data.x0), y(data.y1) - y(data.y0));

            //nodes.size([data.x1 - data.x0/* + x(data.x0)*/, data.y1 - data.y0/* + y(data.y0)*/]);
            x.range([data.x0, data.x1 ]);
            y.range([data.y0, data.y1 ]);



            var mainNew =  loadData(data.data);
            main.selectAll("g").style("fill-opacity",0.2);
            var beforeClick = main.transition().duration(5750);
            var afterClick = mainNew.transition().duration(5750);


            //x.range([(data.x0), /*(data.x0) + */data.x1 - data.x0]);
            //y.range([(data.y0), /*(data.y0) + */data.y1 - data.y0]);
            //x.domain([data.x, data.x + data.dx]);
            //y.domain([data.y, data.y + data.dy]);

            x.domain([(data.x0), /*(data.x0) + */data.x1]);
            y.domain([(data.y0), /*(data.y0) + */data.y1]);
            //x.domain([0,data.x1 - data.x0]);
            //y.domain([0,data.y1 - data.y0]);
            console.log(data.y0, y(0));


            console.log("x", [(data.x0), /*(data.x0) + */(data.x1)]);
            console.log("y", [(data.y0), /*(data.y0) + */(data.y1)]);

            //beforeClick.style("shape-rendering", null);

            mainNew.selectAll("text").style("fill-opacity", 0);

            afterClick.selectAll("rect").call(rect);
            beforeClick.selectAll("rect").call(rect);


            beforeClick.remove()/*.each("end", function() {
                //beforeClick.style("shape-rendering", "crispEdges");
                transitioning = false;
            });*/
                x.domain([0, 400])
                .range([0, 400]);
                y.domain([0, 400])
                .range([0, 400]);


        }

        return children;
    }

    function treematStart(data){
        data.depth = 0;

        var roots = d3.hierarchy(data, childrens);
        console.log("childrens", data);
        function childrens(d){
            
            if(d.depth === 0){
                return d.children;
            }
            return null;
        };

        console.log(">>>>>", roots );

        var treemap = nodes(roots.sort(function(a, b) { return a.value - b.value; }))
            .descendants();

            //console.log("treematStart>>", treemap);
        return treemap;
    }



    

    //------- object prepear ----------
    function initialize(object) {
        
        object.x = object.y = 0;
        object.dx = 400;
        object.dy = 400;
        object.depth = 0;
    }

    function accumulate(object, value) {
        //object._children = object.children
        
        if ( object.children ){
            for(var i = 0; i < object.children.length; i++){
                object.children[i]._parent = object;
            }
            return object[value] = object.children.reduce(function(p, v) {return p + accumulate(v, value);}, 0);
        } else {
            return object[value];
        };

    }

    function accumulateAll(array, object){
        for (var i = 0; i < array.length; i++) {
            accumulate(object, array[i])
        }
        
    }

    function layout(object) {
        if (object.children) {
            //treemap.nodes({_children: object._children});
            treematStart(object);

            //object._children.forEach(function(c) {
            //    c.x = object.x + c.x * object.dx;
            //    c.y = object.y + c.y * object.dy;
            //    c.dx *= object.dx;
            //    c.dy *= object.dy;
            //    c.parent = object;
            //    layout(c);
            //});
        }
    }


    function rect(rect) {
        console.log(rect);
        rect.attr("x",function(d){ return  x(d.x0); })
            .attr("y",function(d){ return y(d.y0); })
            .attr("width",function(d){return x(d.x1) - x(d.x0); })
            .attr("height",function(d){return y(d.y1) - y(d.y0); })
            .attr("fill", function(d){return d.data.done ? color(d.data.done) : null;})
            .attr("stroke", "#fff");
    }

};