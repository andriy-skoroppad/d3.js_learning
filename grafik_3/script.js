window.onload = function(){


var color =  d3.scaleLinear()//градієнт кольорів відносно величини
        .domain([0, 1000])
        .range(["#7fffd4" , "#2a3c01" ]);

    var x = d3.scaleLinear()
        .domain([0, 150])
        .range([0, 150]);

    var y = d3.scaleLinear()
        .domain([0, 150])
        .range([0, 150]);

    var  nodes = d3.treemap()
            .round(false);

    


    d3.json("../data.json", loadData);

    var element = document.querySelector(".chart");

    var canvasForTreemap = d3.select(element).style("overflow", "hidden");

    function loadData(data){
        initialize(data);

        accumulateAll(["value", "done"], data);

        //layout(data);
        console.log(data);

        // var svgForTreemap =  canvasForTreemap.append("svg")
        //     .attr("height", 150)
        //     .attr("width", 150);

        // var main = svgForTreemap.append("g")
        //     .datum(data)
        //     .attr("class", "depth");

        // var children = main.selectAll("g")
        //     .data(data._children)
        //     .enter()
        //     .append("g");

        // children.filter(function(d){ return d._children})
        //     .classed("children", true)
        //     .on("click", transition);

        // children.append("rect")
        //     .attr("class", "parent")
        //     .call(rect)
        //     .append("title")
        //     .text(function(d){ return d3.format(",d")(d.value); })

        treematStart(data)
    }

    function treematStart(data){
        var roots = d3.hierarchy(data, childrens);

function childrens(d){
    console.log("childrens", d);
    return d.children;
}
        


        var treemap = nodes(roots.sort(function(a, b) { return a.value - b.value; }))
            .descendants();

            console.log("treematStart>>", treemap);

    }



    function transition(data){
        console.log(data);
    }

    //------- object prepear ----------
    function initialize(object) {
        
        object.x = object.y = 0;
        object.dx = 150;
        object.dy = 150;
        object.depth = 0;
    }

    function accumulate(object, value) {
        if ( object.children ){
            //object._children = object.children
            return object[value] = object.children.reduce(function(p, v) { return p + accumulate(v, value); }, 0);
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
        if (object._children) {
            //treemap.nodes({_children: object._children});
            treematStart(object);

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


    

    

    

    function rect(rect) {
        rect.attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y); })
            .attr("width",function(d){return x(d.x + d.dx) - x(d.x); })
            .attr("height",function(d){return y(d.y + d.dy) - y(d.y); })
            .attr("fill", function(d){return d.done ? color(d.done) : null;})
            .attr("stroke", "#fff");
    }

};