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

    rect.attr("x",function(d){ return  x(d.x0); })
        .attr("y",function(d){ return y(d.y0); })
        .attr("width",function(d){return x(d.x1) - x(d.x0); })
        .attr("height",function(d){return y(d.y1) - y(d.y0); })
        .attr("fill", function(d){return d.data.done ? color(d.data.done) : null;})
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

function prepearForVisual(height, width, margin, spaceBetwin, data){
    var namberOfElement = dataMy.length;
    var dataSpace = width - margin * 2 - spaceBetwin * (namberOfElement - 1);
    var widthOfElement = dataSpace / namberOfElement;

    var grafHeigth = height - margin * 2;
    
}

function newElement(height, width){
    var element = document.querySelector(".chart");
    var canvasForTreemap = d3.select(element).style("overflow", "hidden");
    var svgForTreemap =  canvasForTreemap.append("svg")
        .attr("height", height)
        .attr("width", width);

    var main = svgForTreemap.append("g")
        .data(dataMy)
        .enter()
        .call(rect)

}

window.onload = function(){

    newElement(400, 400);






}