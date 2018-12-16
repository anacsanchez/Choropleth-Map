d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json")
  .then(data => fetchEducation(data))

const fetchEducation = (countyData) => {
  d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")
  .then(data => createChoropleth(data, countyData))
}

function createChoropleth(educationData, countyData) {
  d3.select("#choropleth")
    .append("div")
    .attr("id", "description")

  const choropleth = d3.select("#choropleth")
                        .append("svg")
                        .attr("width", 1000)
                        .attr("height", 800)
                        .attr("fill", "white")

  const path = d3.geoPath()

  choropleth.append("g")
            .selectAll("path")
            .data(topojson.feature(countyData, countyData.objects.counties).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("class", "county")

  choropleth.append("path")
            .datum(topojson.mesh(countyData, countyData.objects.states, function(a,b) {return a !== b}))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", "2")
            .attr("d", path)

}
