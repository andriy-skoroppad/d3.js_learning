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

    var transitioning = false;
    //var backUp = canvasForTreemap.append("button")
    //    .text("back");
    //backUp.on("click", function(){
    //    console.log(">>>>>>>>", elementParent);
    //    transition(elementParent);
    //});
    var backUp, backUpDone = true;
    
    function loadData(loadingData){

        accumulateAll(["value", "done"], loadingData);

        var newData = treematStart(loadingData);


        var main = svgForTreemap.append("g")
             .datum(newData)
             .attr("class", "depth");

         var children = main.selectAll("g")
             .data(newData)
             .enter()
             .append("g");

         children.filter(function(d){ return !d.children})
             .classed("children", true)
             .on("click", function(d){transition(d, main, loadingData)});

         children.append("rect")
             .attr("class", "parent")
             .call(rect)
             .append("title")
             .text(function(d){ return d3.format(",d")(d.value); });

        console.log("sssssssss", newData);

        

        return main;
    }

    function treematStart(data){
        data.depth = 0;

        var roots = d3.hierarchy(data, childrens);

        function childrens(d){
            
            if(d.depth === 0){
                return d.children;
            }
            return null;
        };



        var treemap = nodes(roots.sort(function(a, b) { return a.value - b.value; }))
            .descendants();


        return treemap;
    }
function transition(data, main, oldObject){



            console.log("oldObject", oldObject);

            if(transitioning) return false;

            transitioning = true;

            //nodes.size([data.x1 - data.x0/* + x(data.x0)*/, data.y1 - data.y0/* + y(data.y0)*/]);

            if(backUpDone){//doun
                x.range([data.x0, data.x1 ]);
                y.range([data.y0, data.y1 ]);
                var mainNew =  loadData(data.data);

                main.selectAll("g").transition().duration(550).style("fill-opacity",0.1);
                var beforeClick = main.transition().duration(750);
                var afterClick = mainNew.transition().duration(750);

                x.domain([(data.x0), /*(data.x0) + */data.x1]);
                y.domain([(data.y0), /*(data.y0) + */data.y1]);

                mainNew.selectAll("text").style("fill-opacity", 0);

                afterClick.selectAll("rect").call(rect);

                x.range([0, 400 ]);
                y.range([0, 400 ]);
                beforeClick.selectAll("rect").call(rect);

                beforeClick.remove().on("end", function() {

                    backUpDone = true;
                    transitioning = false;


                    if(data.data) {
                        backUp = canvasForTreemap.append("button")
                            .datum(data.data._parent)
                            .text(function (d) {
                                return "back to " + d.name;
                            });
                        backUp.on("click", function (d) {
                            backUpDone = false;
                            transition(d, mainNew, data);
                        });
                    }

                });

            } else {//up
                console.log(data);
                
                x.domain([(oldObject.x0), /*(data.x0) + */oldObject.x1]);
                y.domain([(oldObject.y0), /*(data.y0) + */oldObject.y1]);
                
                var mainNew = loadData(data);
                console.log(oldObject);
                //main.selectAll("g").transition().duration(550).style("fill-opacity",0.1);
                var beforeClick = main.transition().duration(750);
                var afterClick = mainNew.transition().duration(750);

                
                x.range([oldObject.x0, oldObject.x1 ]);
                y.range([oldObject.y0, oldObject.y1 ]);

                afterClick.selectAll("rect").call(rect);

                


                beforeClick.selectAll("rect").call(rect);
                beforeClick.remove();
                var  deleteButton = false;
                backUp.filter(function(d, i){ if(d === data) deleteButton = true; return d === data;}).remove()

                backUpDone = true;
                transitioning = false;

            };

            

            
                x.domain([0, 400])
                .range([0, 400]);
                y.domain([0, 400])
                .range([0, 400]);

            

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
                object.children[i].depth = null;
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

        rect.attr("x",function(d){ return  x(d.x0); })
            .attr("y",function(d){ return y(d.y0); })
            .attr("width",function(d){return x(d.x1) - x(d.x0); })
            .attr("height",function(d){return y(d.y1) - y(d.y0); })
            .attr("fill", function(d){return d.data.done ? color(d.data.done) : null;})
            .attr("stroke", "#fff");
    }

};