// HT to Jeremia Kimelman for the historical data file
// https://observablehq.com/d/cfc7caf8f50d44dd
d3.csv("https://raw.githubusercontent.com/mitchthorson/lede-2022-dataviz/main/03-d3-animation/completed-animated-chart/countries.csv")
	.then(data => {
  
		const height = 500
		const width = 900
		const margin = 45

		const populationMin = d3.min(data, d => +d.population)
		const populationMax = d3.max(data, d => +d.population)

		const incomeExtent = d3.extent(data, d => +d.income_per_person)
		const years = d3.extent(data, d => +d.year)

		const regionColors = {
			africa: "deepskyblue",
			asia: "tomato",
			americas: "limegreen",
			europe: "gold",
		}

		const yScale = d3.scaleLinear()
			.domain([0, 100])
			.range([height - (2 * margin), 0])

		const xScale = d3.scaleLog()
			.domain(incomeExtent)
			.range([0, width - (2 * margin)])

		const rScale = d3.scaleSqrt()
			.domain([populationMin, populationMax])
			.range([2, 40])

		let year = years[0]

		const svg = d3.select('#chart')
			.append("svg")
			.attr("height", height)
			.attr("width", width)

		const yearlyData = data.filter(function(d) {
			return +d.year === year
		})

		svg.append('g')
			.attr("class", "circles")
			.attr('transform', `translate(${margin} ${margin})`)
			.selectAll('circle')
			.data(yearlyData, d => d.country)
			.join('circle')
			.attr('cy', d => yScale(+d.life_expectancy) )
			.attr('cx', d => xScale(+d.income_per_person) )
			.attr('r', d => rScale(+d.population) )
			.attr('fill', d => regionColors[d.region])
			.attr('opacity', .8)

		const format = d3.format('.2s')

		const xAxis = d3.axisBottom().scale(xScale).ticks(5, format)
		const yAxis = d3.axisLeft().scale(yScale)

		svg.append('g')
			.attr('transform', `translate(0 ${height - margin})`)
			.attr("class", "x-axis")
			.call(xAxis)

		svg.append('g')
			.attr('transform', `translate(${margin / 2} ${margin})`)
			.attr("class", "y-axis")
			.call(yAxis)

		svg.append('text')
			.attr('id', 'year')
			.attr('dy', height * .8)
			.attr('dx', 20)
			.attr('font-size', '100px')
			.attr('opacity', .3)
			.text(year)
		
		
		//create a new function to show objects
		function show(selector, opacity = 1){
			svg.selectAll(selector)
					.transition(100)
					.attr("opacity", opacity)
		}
		//create a new function to hide objects
		function hide(selector){
			svg.selectAll(selector)
			.transition(100)
			.attr("opacity", 0)
		}

		//hide codes
		//svg.selectAll("circle").attr("opacity", 0)
		hide(".circles")
		//#ID	
		hide("#year")
		//.class
		hide(".x-axis")
		hide(".y-axis")

		//scrollama
		//https://github.com/russellgoldenberg/scrollama
		const scroller = scrollama();
		// setup the instance, pass callback functions
		let interval = null

		scroller			
			.setup({
				//".step" -->s) selector for the step elements that will trigger changes.
  				step: ".step",
				offset: 0.5,
				// debug: true
			})
			// Callback (function) that fires when the top or bottom edge of a step element enters the offset threshold
			//element: The step element that triggered
			//index: The index of the step of all steps
			//direction: 'up' or 'down'
			.onStepEnter((response) => {
  				// // { element, index, direction }
				//output log to console (just for checking)
				console.log("Actvated step: " + response.index)
				if (response.index === 0) {
					// svg.selectAll(".x-axis")
					// 	.transition(100)
					// 	.attr("opacity", 1)
					hide(".x-axis")
					hide(".y-axis")
					hide(".circles")
					hide("#year")

				} else if (response.index === 1) {
					// svg.selectAll(".x-axis")
					// 	.transition(100)
					// 	.attr("opacity", 1)
					show(".x-axis")
					hide(".y-axis")
					hide(".circles")
					hide("#year")
				} else if (response.index === 2) {
					// svg.selectAll(".y-axis")
					// 	.transition(100)
					// 	.attr("opacity", 1)
					show(".x-axis")
					show(".y-axis")
					hide(".circles")
					hide("#year")
				} else if (response.index === 3) {
					// svg.selectAll("circle")
					// 	.transition(100)
					// 	.attr("opacity", 1)
					show(".x-axis")
					show(".y-axis")
					show(".circles")
					hide("#year")
				} else if (response.index=== 4) {
					show(".x-axis")
					show(".y-axis")
					show(".circles")
					show("#year", 0.5)
					
					if (interval !==null) {
						clearInterval(interval)
					}

				} else if (response.index=== 5){
					show(".x-axis")
					show(".y-axis")
					show(".circles")
					show("#year", 0.5)

					interval = setInterval(function() {
						if (year === years[1]) {
							return
						} else {
							year = year + 1
						}
			
						const yearlyData = data.filter(function(d) {
							return +d.year === year
						})
			
						d3.select('#year').text(year)
			
						svg.selectAll('circle')
							.data(yearlyData, d => d.country)
							.transition(100)
							.attr('cy', d => yScale(+d.life_expectancy) )
							.attr('cx', d => xScale(+d.income_per_person) )
							.attr('r', d => rScale(+d.population) )
			
					}, 200)

				}

			})

			//Callback that fires when the top or bottom edge of a step element exits the offset threshold.
			// .onStepExit((response) => {
  			// // { element, index, direction }
			// });
	
})

