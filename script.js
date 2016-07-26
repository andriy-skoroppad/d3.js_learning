window.onload = function () {

    var data = [40, 70, 20, 50, 60, 70];

    var scale = d3.scale.linear()//маштабування відносне
                .domain([0, 70])//відносно максимальної і мінімальної цифри значення
                .range([0, /*width*/ 500]);//відносно розміру самого зображення

    var color =  d3.scale.linear()//градієнт кольорів відносно величини
                .domain([0, 70])
                .range(['#FF0101', /*gradient*/ '#01FF2B']);

    var axis = d3.svg.axis()//оголошення риски з величинами
                .ticks(3)//кількість відміток
                .scale(scale)

    var svg = d3.select('body')
                .append('svg')
                .attr('height', 300)
                .attr('width', 500)
                .append('g')
                .attr('transform', 'translate(50, 50)')
                

    var base = svg.selectAll('rect')
                .data(data)
                .enter()//не існує ще елементів
                    .append('rect')
                    .attr('height', 10)
                    .attr('width', function (d){ return scale(d); })//or d * 3 or enother
                    .attr('y', function(d, i){ return i * (10 + 1); })
                    .attr('fill', function(d){ return color(d); });
  
    svg.append('g')
        .attr('transform', 'translate(0, 100)')
        .call(axis)//визиває риску з позаченням велечин

        //-----------enter method - ------

    var svgEnter = d3.select('body')
                .append('svg')
                .attr('height', 500)
                .attr('width', 500)

    var testCircle = svgEnter.append('circle')
                        .attr('cx', 100)
                        .attr('cy', 100)
                        .attr('r', 90)
                        
    var circles = svgEnter.selectAll('circle')
                    .data(data)
                    .attr('fill', '#800000')//апдейт існуючого кола 
                    .attr('r', function (d){ return d / 2;})//апдейт існуючого кола
                    //.exit()//оперує обєктами які виходять за рамки масиву даних 
                    .enter()//створює не існуючі кола дотих пір поки є дані пропукаючи існ і дані відповідно
                        .append('circle')
                        .attr('cx', function (d){return d / 2;})
                        .attr('cy', function(d, i){ return (i + 1) * ( d / 2 + 20);})
                        .attr('r', function (d){ return d / 2;})
                        .attr('fill', function(d){ return color(d); });
    testCircle.transition()
            .duration(1000)
            .delay(1000)
            .attr('cy', 300)
            .attr('fill', '#FF0000')
            .each('end' /*'start'*/, function(){ d3.select(this).attr('fill', 'bleak'); })//функція по завершенню або по іншому івенту і виконує щонебудь
            .transition()
            .duration(1000)
            .attr('cy', 100)
            .attr('fill', '#800000')



    var dataForSvg = [
        {
            name: "Stanford",
            img: "fdr.img",
            applicants: 300
        },
        {
            name: "Stanford2",
            img: "fdr2.img",
            applicants: 250
        },
        {
            name: "Stanford3",
            img: "fdr3.img",
            applicants: 195
        },
        {
            name: "Stanford4",
            img: "fdr4.img",
            applicants: 120
        },
        {
            name: "Stanford5",
            img: "fdr5.img",
            applicants: 50
        },
        {
            name: "Stanford6",
            img: "fdr6.img",
            applicants: 39
        },
        {
            name: "Stanford7",
            img: "fdr7.img",
            applicants: 26
        },
        {
            name: "Stanford8",
            img: "fdr8.img",
            applicants: 7
        },
        {
            name: "Stanford9",
            img: "fdr9.img",
            applicants: 3
        },
        {
            name: "Stanford10",
            img: "fdr10.img",
            applicants: 0
        }

    ];








};



function getNumber(max, count){

    var setting = {
        max : [[50, 0],[500, 2],[10000, 2]],
        toNumb : [2, 5, 10, 20, 50, 100, 150, 200, 250, 500, 1000,2000, 5000, 10000]
    };

    

    console.log( max / count);
    var findCorectNumber = false;

    for(var maxS = 0; maxS < setting.max.length; maxS++){
        if(max < setting.max[maxS][0] || maxS === (setting.max.length - 1)){
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                for(var ii = setting.max[maxS][1]; ii <  setting.toNumb.length; ii++){
                    if( (numb) % setting.toNumb[ii] === 0 ){
                        if(numb > 120){
                            if( (numb) % 50 === 0 ){
                                findCorectNumber = true;
                                return numb;
                            }

                        } else {
                            findCorectNumber = true;
                            return numb;

                        }
                         
                    }
                }
            }
            return "finde " + max;
        }
    }
    
    return 'none';
}

function scrollWidthButom(widthOll, screenWidth, scrollButom, minWidthB){
    var widthB = screenWidth * scrollButom / widthOll;
    if(widthB < minWidthB){
        widthB = minWidthB;
    };
    return [[scrollButom - widthB, widthB], [widthOll - screenWidth, screenWidth]];
}

/*$(document).ready(function(){
    $(function () {
        $('#container').highcharts({

            chart: {

                type: 'column',

                zoomType: 'x'
            },
            title: {
                text: 'Project wise Budget Estimation'
            },
            subtitle: {
                text: 'Select area to zoom.Click Reset Zoom to reset selection'
            },
            credits: {
                enabled: true,
                position: {
                    align: 'right',
                    x: -10,
                    verticalAlign: 'bottom',
                    y: -5
                },
                href: "http://www.qualiantech.com",
                text: "Qualian Technologies Pvt Ltd"
            },
            xAxis: {
                categories: ["W 1, Nov 2010", "W 2, Nov 2010", "W 3, Nov 2010", "W 4, Nov 2010", "W 1, Dec 2010", "W 2, Dec 2010", "W 3, Dec 2010", "W 4, Dec 2010", "W 1, Jan 2011", "W 2, Jan 2011", "W 3, Jan 2011", "W 4, Jan 2011", "W 1, Feb 2011", "W 2, Feb 2011", "W 3, Feb 2011", "W 4, Feb 2011", "W 1, Mar 2011", "W 2, Mar 2011", "W 3, Mar 2011", "W 4, Mar 2011", "W 1, Apr 2011", "W 2, Apr 2011", "W 3, Apr 2011", "W 4, Apr 2011", "W 1, May 2011", "W 2, May 2011", "W 3, May 2011", "W 4, May 2011", "W 1, Jun 2011", "W 2, Jun 2011", "W 3, Jun 2011", "W 4, Jun 2011", "W 1, July 2011", "W 2, July 2011", "W 3, July 2011", "W 4, July 2011", "W 1, Aug 2011", "W 2, Aug 2011", "W 3, Aug 2011", "W 4, Aug 2011", "W 1, Sep 2011", "W 2, Sep 2011", "W 3, Sep 2011", "W 4, Sep 2011", "W 1, Oct 2011", "W 2, Oct 2011", "W 3, Oct 2011", "W 4, Oct 2011", "W 1, Nov 2011", "W 2, Nov 2011", "W 3, Nov 2011", "W 4, Nov 2011", "W 1, Dec 2011", "W 2, Dec 2011", "W 3, Dec 2011", "W 4, Dec 2011", "W 1, Jan 2012", "W 2, Jan 2012", "W 3, Jan 2012", "W 4, Jan 2012", "W 1, Feb 2012", "W 2, Feb 2012", "W 3, Feb 2012", "W 4, Feb 2012", "W 1, Mar 2012", "W 2, Mar 2012", "W 3, Mar 2012", "W 4, Mar 2012", "W 1, Apr 2012", "W 2, Apr 2012", "W 3, Apr 2012", "W 4, Apr 2012", "W 1, May 2012", "W 2, May 2012", "W 3, May 2012", "W 4, May 2012", "W 1, Jun 2012", "W 2, Jun 2012", "W 3, Jun 2012", "W 4, Jun 2012", "W 1, July 2012", "W 2, July 2012", "W 3, July 2012", "W 4, July 2012", "W 1, Aug 2012", "W 2, Aug 2012", "W 3, Aug 2012", "W 4, Aug 2012"],
                min: 0,
                max:9

            },
            scrollbar: {
                enabled: true
            },

            yAxis: {
                min: 0,
                title: {
                    text: 'Amount Distribution'
                }
            },
            legend: {
                shadow: true
            },
            tooltip: {
                useHTML: true,
                headerFormat: '<small>{point.key}</small><table>',
                pointFormat: '<tr><td style="color: {series.color}">{series.name}:{point.y} </td>',
                footerFormat: '</table>',
                valueDecimals: 2,
                crosshairs: [{
                    width: 1,
                    color: 'Gray'
                }, {
                    width: 1,
                    color: 'gray'
                }]
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0.5
                }
            },
            series: [{
                name: 'Petty Cash',
                data: [0, 0, 8, 10, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}],



            scrollbar: {
                enabled: true,
                barBackgroundColor: 'gray',
                barBorderRadius: 7,
                barBorderWidth: 0,
                buttonBackgroundColor: 'gray',
                buttonBorderWidth: 0,
                buttonArrowColor: 'yellow',
                buttonBorderRadius: 7,
                rifleColor: 'yellow',
                trackBackgroundColor: 'white',
                trackBorderWidth: 1,
                trackBorderColor: 'silver',
                trackBorderRadius: 7
            }
        });
    });
});*/
var chartHi;
$(document).ready(function(){


        // Create the chart
        chartHi = $('#container').highcharts({
            chart: {
                type: 'column'
            },
            scrollbar: {
                enabled: true,
                height: 18,
                barBackgroundColor: '#cccccc',
                barBorderRadius: 9,
                barBorderWidth: 0,
                buttonBackgroundColor: '#cccccc',
                buttonBorderWidth: 0,
                buttonArrowColor: '#6f6f6e',
                buttonBorderRadius: 9,
                rifleColor: '#6f6f6e',
                trackBackgroundColor: 'transparent',
                trackBorderWidth: 1,
                trackBorderColor: '#cccccc',
                trackBorderRadius: 9
            },
            title: {
                text: 'Browser market shares. January, 2015 to May, 2015'
            },
            subtitle: {
                text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            },
            xAxis: {
                type: 'category',
                min: 0,
                max:3,
                labels: {
                    x: 0,
                    useHTML: true,
                    formatter: function () {

                        return '<div style="text-align: center;"><img height="80px" width="80px" src="' + this.value[1] + '"><img><br>' + this.value[0] + '</div>';
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 60,
                title: {
                    text: 'Total percent market share'
                }


            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                minPointLength: 5,
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: ['Microsoft Internet Explorer', 'img/meet1.jpg'],
                    y: 56.33
                }, {
                    name: ['Chrome', 'img/meet2.jpg'],
                    y: 24.03
                }, {
                    name: ['Firefox', 'img/meet3.jpg'],
                    y: 10.38
                }, {
                    name: ['Safari', 'img/meet4.jpg'],
                    y: 4.77
                }, {
                    name: ['Opera', 'img/meet2.jpg'],
                    y: 0.91
                }, {
                    name: ['Proprietary or Undetectable', 'img/meet4.jpg'],
                    y: 0
                }, {
                    name: ['Proprietary or Undetectable', 'img/meet4.jpg'],
                    y: 0
                }, {
                    name: ['Proprietary or Undetectable', 'img/meet4.jpg'],
                    y: 0
                }, {
                    name: ['Proprietary or Undetectable end', 'img/meet1.jpg'],
                    y: 0
                }]
            }]
        });

    $('#button').click(function() {
        var chart = $('#container').highcharts();
        console.log(chart.xAxis[0]);
        chart.xAxis[0].setExtremes();
    });
    $('#button2').click(function() {
        var chart = $('#container').highcharts();
        console.log(chart.pointCount);
        chart.xAxis[0].setExtremes(chart.pointCount - 4 ,chart.pointCount - 1);
    });

});
