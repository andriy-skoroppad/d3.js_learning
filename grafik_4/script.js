var x = d3.scaleLinear()
    .domain([0, 400])
    .range([0, 400]);

var y = d3.scaleLinear()
    .domain([0, 400])
    .range([0, 400]);

function text(text) {
        text.attr("x",function(d){return x(d.x0); })
            .attr("y",function(d){return y(d.y0); })
            .attr("dy", 20)
            .text(function(d){return d.data.name;})
            .attr("fill", "#000")
            .attr('display', function(d){
                console.log(">>>>>this>>",this.offsetWidth);
                return '';
            });
    }

function rect(rect) {

    rect.attr("x",function(d){console.log(d); return  d.x0; })
        .attr("y",function(d){ return d.y0; })
        .attr("width",function(d){return d.x1 - d.x0; })
        .attr("height",function(d){return d.y1 - d.y0; })
        .attr("fill", function(d){return '#000';})
        .attr("stroke", "#fff");
    }    

var dataMy = [
    {name: "one", value: 150},
    {name: "fereo", value: 200},
    {name: "derts", value: 50},
    {name: "sdw", value: 20},
    {name: "frsd", value: 40},
    {name: "sdas", value: 210}
];

function findeMax(data, name){
    var max = null;
    for (var i = 0; i < data.length; i++) {
        if(max < data[i][name]){
            max = data[i][name];
        }

    }
    return max;
}

function prepearForVisual(height, width, margin, spaceBetwin, data){
    var namberOfElement = dataMy.length;
    var dataSpace = width - margin * 2 - spaceBetwin * (namberOfElement - 1);
    var widthOfElement = dataSpace / namberOfElement;

    var grafHeigth = height - margin * 2;

    var zeroPoint = height - margin;

    var max = findeMax(data, 'value');

    for (var i = 0; i < data.length; i++) {
        data[i].y0 = max - data[i].value;//вниз
        data[i].x0 = margin + i * widthOfElement + i * spaceBetwin;
        data[i].y1 = zeroPoint;
        data[i].x1 = data[i].x0 +  widthOfElement;
    }
    
}

function newElement(height, width){
    prepearForVisual(height, width, 5, 5, dataMy);
    console.log(dataMy);
    var element = document.querySelector(".chart");
    var canvasForTreemap = d3.select(element).style("overflow", "hidden");
    var svgForTreemap =  canvasForTreemap.append("svg")
        .attr("height", height)
        .attr("width", width);
        console.log('dddd')

    var main = svgForTreemap.append("g")
        .selectAll("g")
        .data(dataMy)
        .enter()
        .append("rect")
        .call(rect)

}

window.onload = function(){

    newElement(400, 400);






}