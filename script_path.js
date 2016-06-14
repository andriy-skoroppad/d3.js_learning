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

	//----chart simple----проста забита вручну дуга

	
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
	//--------normal chart -----------------------
	var dataForNormalChart = [10, 50, 70];
	var radius = 100;

	var colorOfChartParts = d3.scale.ordinal()//попорядку задає колір
				.range(['#C1C350', '#5BC34F', '#5D67C3']);

	var canvas = d3.select('body').append('svg')
				.attr('width', 300)
				.attr('height', 300)
	var groupElements = canvas.append('g')
				.attr('transform', 'translate(100, 100)');
	var arcN = d3.svg.arc()//створення кола
				.innerRadius(50)
				.outerRadius(radius);

	var pie = d3.layout.pie()//фенкція яка правильно форматує дані
				.value(function(d){return d;})

	var arcs = groupElements.selectAll('.arc')
				.data( pie(dataForNormalChart) )// відформатовані дані
				.enter()
				.append('g')
				.attr('class', 'arc');

	arcs.append('path')
				.attr('d', arcN)//створення 
				.attr('fill', function(d){return colorOfChartParts(d.data); }); //заливка відповідним кольором
	arcs.append('text')
				.text(function(d){ return d.data; })//всавляє текст в даному випадку число відповідне
				.attr('transform', function(d){ return 'translate(' + arcN.centroid(d) + ')'})//переміщає текст по середині дуги
				.attr('text-anchor', 'middle')//вирівює текст




}