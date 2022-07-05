d3.csv("./oscars.csv")
    .then(data => {
        const years = data.filter(item => item.winner === 1)
        console.log(years)
    })