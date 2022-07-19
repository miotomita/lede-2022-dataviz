//csv data for a single year (2019)
//d3.csv("./GapminderData.csv").then(data => {

//time-series data
d3.csv("https://raw.githubusercontent.com/miotomita/lede-2022-dataviz/main/03-d3-animation/countries.csv").then(data => {
    //const:The const declaration creates a immutable (read-only) reference to a value
    //var variables can be re-declared and updated
    //let can be updated but not re-declared
    const width = 800
    const height = 400
    const margin = 40
    
    //yScale
    const yScale = d3.scaleLinear()
                    //domain:to encode, range:output range
                    .domain([0,100])
                    //.range([highest, lowest]) inverted order!!
                    .range([height - (margin * 2), 0])
    
    //break down data by year
    const yearsExtent = d3.extent(data, d => +d.year)
    let currentYear = yearsExtent[0];
    let currentYearData = data.filter(d => +d.year === currentYear)
    //printing out just for checking
    //console.log(currentYear)

    //xScale
    //calculate min/max values using d3.array package 
    //documentation: https://github.com/d3/d3-array
    //method 1: min/max
    //+ sign transform d from strting to numbers
    const minIncome = d3.min(data, d => +d.income_per_person)
    const maxIncome = d3.max(data, d => +d.income_per_person)
    const xScale = d3.scaleLog()
                    .domain([10, maxIncome])
                    .range([0, width - (margin * 2)])
    //method 2: calculate min, max at once
    //const minMaxIncome = d3.extent(data, d => +d.income_per_person)
    //const xScale = d3.scaleLog().domain(minMaxIncome).range([0, width])
    
    //draw circle from population size 
    const populationExtent = d3.extent(data, d => +d.population)
    const radiusScale = d3.scaleSqrt().domain(populationExtent).range([2, 40])
    
    //color
    //color method1 : assigning colors by names (hex, rgb, etc)
    const regionColors = {
        africa: "deepskyblue",
        asia: "tomato",
        americas: "limegreen",
        europe: "gold"
    }

    //color method 2: using color scheme
    // https://github.com/d3/d3-scale-chromatic
    //const colorScale = d3.scaleOrdinal().range(d3.schemeAccent)
    //svg.selectAll("circle").data(data).join("circle").attr("fill", d => colorScale(d.region))

    //select object with #id, #chart is the id assigned in index.html
    //<div id="chart"></div>  --> append creates a tab for svg <div id="chart"><svg></svg></div>
    const svg = d3.select("#chart")
        .append("svg")
        //<svg height="400" width="800"></svg>
        .attr("height", height)
        .attr("width", width)
    
    svg.append("g")
        //moving the position
        .attr("transform", "translate(" + margin + ", " + margin + ")")
        .selectAll("circle")
        //1: visualizing the whole dataset 
        //.data(data)
        //2: visualizing filtered data
        .data(currentYearData)
        .join("circle")
        //<circle cx="50" cy="50" r="50"/>
        //cx: x-axis coordinate of the center of the circle
        .attr("cx", d => xScale(+d.income_per_person))
        //cy: y-axis coordinate of the center of the circle
        .attr("cy", d => yScale(+d.life_expectancy))
        // r: the radius of the circle. 
        .attr("r", d => radiusScale(+d.population))
        //fill: fill color
        //method 1: using assigned colors
        .attr("fill", d => regionColors[d.region])
        //method 2: using color scheme
        //.attr("fill", d => colorScale(d.region))
        .attr("opacity", 0.75)
        .attr("stroke", "black")
    
    const xAxis = d3.axisBottom(xScale)
    
    //"g": create a group element
    //The <g> SVG element is a container used to group other SVG elements.
    //https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g
    svg.append("g")
        //positionin
        //"transform=translate(0, height)"
        .attr("transform", "translate(" + margin +", " + (height - margin) + ")")
        .call(xAxis)
    
    const yAxis = d3.axisLeft(yScale)

    svg.append("g")
        .attr("transform", "translate(" + margin + ", " + margin + ")")
        .call(yAxis)
    
    svg.append("text")
        .text(currentYear)
        //add ID for year #current-year
        .attr("id", "current-year")
        .attr("transform", "translate(60, 100)")
        .attr("font-size", "100px")

    //looping
    //The setInterval() method, offered on the Window and Worker interfaces, repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
    //setInterval(code, delay)
    //https://developer.mozilla.org/en-US/docs/Web/API/setInterval
    
    setInterval(function() {
        if (currentYear == yearsExtent[1]){
            return
        }
        currentYear = currentYear + 1
        //already assinged so we don't need "let" here
        currentYearData = data.filter(d => +d.year === currentYear)
        //console.log(currentYear)

        svg.selectAll("circle")
            .data(currentYearData)
            .transition(200)
            .attr("cy", d => yScale(+d.life_expectancy))
            .attr("cx", d => xScale(+d.income_per_person))
            .attr("r", d => radiusScale(+d.population))
        
        //fetch year by #ID
        svg.select("#current-year")
            .text(currentYear)
    }, 200)
})