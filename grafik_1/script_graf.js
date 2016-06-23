
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

    var maxCount = NaN;
    var minCount = 0;

    //------- settings block end ------

    //------- object prepear ----------
    function accumulate(object, value) {
        if ( object.children){
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

    function loadData( data ){

        accumulateAll(settings.myData, data);//prepear data

        console.log('>>>load done and data is >>>', data);

        var treemap = d3.layout.treemap()
            .children(function(d, depth) { return depth ? null : d.children; })
            .size([settings._mainBlockWidth, settings._mainBlockHeight])
            .nodes( data );
        console.log( treemap );

        var cells = svg.selectAll( "." + settings.classesForCell)
            .data( treemap )
            .enter()
            .append("g")
            .attr("class", settings.classesForCell);

        cells.append("rect")
            .attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y); })
            .attr("width",function(d){return x(d.dx); })
            .attr("height",function(d){return y(d.dy); })
            .attr("fill", function(d){return d.done ? color(d.done) : null;})
            .attr("stroke", "#fff")

        cells.append("text")
            .attr("x",function(d){return x(d.x); })
            .attr("y",function(d){return y(d.y ); })
            .attr("dy", 20)
            .text(function(d){return d.name;})
            .attr("fill", "#000")
    };

    d3.json("../data.json", loadData);

};