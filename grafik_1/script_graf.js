
window.onload = function(){

    //------- settings block start ------
    var settings = {};
    settings.classesForCell = "treemap1";
    settings.mainBlock = document.querySelectorAll(".chart")[0];
    settings._mainBlockWidth = settings.mainBlock.offsetWidth;
    settings._mainBlockHeight = settings.mainBlock.offsetHeight;

    //------- settings block end ------

    var svg = d3.select(settings.mainBlock).append("svg")
        .attr("width", settings._mainBlockWidth)
        .attr("height", settings._mainBlockHeight);

    console.log( settings );


    function bildTreemap (dataForTreemap) {

        return treemap;
    }

    function loadData( data ){
        console.log('>>>load done and data is >>>', data);

        var treemap = d3.layout.treemap()
            .size([settings._mainBlockWidth, settings._mainBlockHeight])
            .nodes( data );
        console.log( treemap );

        var cells = svg.selectAll( "." + settings.classesForCell)
            .data( treemap )
            .enter()
            .append("g")
            .attr("class", settings.classesForCell);

        cells.append("rect")
            .attr("x",function(d){return d.x; })
            .attr("y",function(d){return d.x; })
            .attr("width",function(d){return d.dx; })
            .attr("height",function(d){return d.dx; })


    };

    d3.json("../data.json", loadData);

};