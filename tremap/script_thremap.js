window.onload = function () {
console.log('<<<<<three map start>>>>>>');

    var mainObject = {
        "name": "main",
        "children": []
    };

    var chart = d3.select('.chart');
    console.log(parseFloat(chart.style('height')), parseFloat(chart.style('width')));

    var graph = {};
    graph.height = parseFloat(chart.style('height'));
    graph.width = parseFloat(chart.style('width'));

    d3.json("../data-json.csv", function(root) {
        mainObject.children = formattingData(root);
        console.log(mainObject.children[0], root[0]);
        mainObject.x = mainObject.y = 0;
        mainObject.dx = graph.width;
        mainObject.dy = graph.height;
        mainObject.depth = 0;
        console.log(mainObject)
    });


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
                "value": parseFloat(el[1]),
                "children": []
            };

            pasteIn.push(object);
        });

        return pasteIn;
    }




    chart.append('svg')
        .attr('height', graph.height)
        .attr('width', graph.width);

};