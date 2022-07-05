d3.csv("https://raw.githubusercontent.com/miotomita/lede-2022-dataviz/main/01-web-viz/demo-oscar-winners/oscars.csv")
    .then(data => {
        const years = data.filter(item => item.winner === "1")
            .map(item => item.year)
        
        console.log(years)

        d3.select("#year")
            .selectAll("option.opt")
            .data(years)
            .join("option")
    })