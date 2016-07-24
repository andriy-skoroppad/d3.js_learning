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
}

function getNumber(max, count){

    var setting = {
        max : [[50, 0],[500, 2],[10000, 5]],
        toNumb : [2, 5, 10, 20, 50, 100, 200, 250, 500, 1000,2000, 5000, 10000]
    };

    

    console.log( max / count);
    var findCorectNumber = false;

    for(var maxS = 0; maxS < setting.max.length; maxS++){
        if(max < setting.max[maxS][0] || maxS === (setting.max.length - 1)){
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                for(var ii = setting.max[maxS][1]; ii <  setting.toNumb.length; ii++){
                    if( (numb) % setting.toNumb[ii] === 0){
                        findCorectNumber = true;
                        return numb; 
                    }
                }
            }
            return "finde " + max;
        }
    }
    
        /*
        if(max < 50){
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                if( (numb) % 2 === 0 || (numb) % 5 === 0 || (numb) % 10 === 0 ){
                    findCorectNumber = true;
                    return numb;
                }
            }
        } else if (max < 500){
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                if( (numb) % 10 === 0 || (numb) % 20 === 0 || (numb) % 50 === 0 || (numb) % 100 === 0 || (numb) % 200 === 0 || (numb) % 250 === 0 || (numb) % 500 === 0 ){
                    findCorectNumber = true;
                    return numb;
                }
            }
        } else if (max < 10000){
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                if((numb) % 100 === 0 || (numb) % 200 === 0 || (numb) % 250 === 0 || (numb) % 500 === 0 ){
                    findCorectNumber = true;
                    return numb;
                }
            }
        } else {
            for(var i = 0; !findCorectNumber ; i++){
                var numb = (max + i) / count;
                if((numb) % 1000 === 0 || (numb) % 2000 === 0 || (numb) % 2500 === 0 || (numb) % 5000 === 0 ){
                    findCorectNumber = true;
                    return numb;
                }
            }
        }
        */
    return 'none';
}