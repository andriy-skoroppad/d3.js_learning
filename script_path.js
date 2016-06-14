window.onload = function () {
	console.log('<<<<<path start>>>>>>')

	var svg = d3.select('body')
				.append('svg')
				.attr('height', 300)
				.attr('width', 400);

	var dataForGrafic= [
		{x:10, y: 50},
		{x:20, y: 55},
		{x:30, y: 90},
		{x:40, y: 60},
		{x:50, y: 90},
		{x:60, y: 60},
		{x:70, y: 90},
		{x:80, y: 60},
		{x:90, y: 90},
		{x:100, y: 60},
		{x:110, y: 90},
		{x:120, y: 0}
	];

	var group = svg.append('g')
				.attr('transform', 'translate( 10, 10)');
	var line = d3.svg.line()
				.x(function(d){ return d.x * 2; })
				.y(function(d){ return d.y * 2; })
	group.selectAll('path')
				.data([dataForGrafic])//[]потрібні тому що лінія має бути одна
				.enter()
				.append('path')//створення фігури
				.attr('d', line)//функція line створює сама кординати
				.attr('fill', 'none')//забираєм задній фон bacgroung?
				.attr('stroke', '#000')
				.attr('stroke-width', '3');

	//----chart simple----

	
	var r = 50;
	var p = Math.PI * 2;
	var svgForCharts = d3.select('body')
				.append('svg')
				.attr('height', 300)
				.attr('width', 400)
				.append('g')
				.attr('transform', 'translate(' + r * 2 + ',' + r * 2 + ')');
	
	var arc = d3.svg.arc()
				.innerRadius(r - 30)
				.outerRadius(r)
				.startAngle(0)
				.endAngle( p / 1.8 );

	svgForCharts.append('path')
				.attr('d', arc)
				.attr('fill', 'red')
				.attr('stroke', '#000')
				.transition().duration(1000)
				.attr('fill', '#0000FF');

}