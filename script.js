d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json")
  .then(data => fetchEducation(data))

const fetchEducation = (countyData) => {
  d3.json("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json")
  .then(data => createChoropleth(data, countyData))
}

const width = 1000;
const height = 600;
const padding = 60;

function createChoropleth(educationData, countyData) {
  d3.select("#choropleth")
    .append("div")
    .attr("id", "description")

  const choropleth = d3.select("#choropleth")
                        .append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .attr("fill", "white")

  const path = d3.geoPath()

  const tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", "0")

  const minEducation = d3.min(educationData, d => d.bachelorsOrHigher)
  const maxEducation = d3.max(educationData, d => d.bachelorsOrHigher)

  const range = d3.range(0, 100, 10)

  const colorScale = d3.scaleSequential(d3.interpolateGreens)
                        .domain([minEducation, maxEducation])

  const eduScale = d3.scaleLinear()
                      .domain([0, 100])
                      .range([50, ((range.length+1)*50)])

  let eduMap = new Map();
  let i = 0;

  while (i < educationData.length) {
    eduMap.set(educationData[i].fips, educationData[i])
    ++i;
  }

  choropleth.append("g")
            .selectAll("path")
            .data(topojson.feature(countyData, countyData.objects.counties).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("data-fips", d => d.id)
            .attr("data-education", d => eduMap.get(d.id).bachelorsOrHigher)
            .attr("class", "county")
            .attr("fill", d => colorScale(eduMap.get(d.id).bachelorsOrHigher))
            .on("mouseover", function(d) {
              tooltip.style("opacity", "1")
                      .attr("width", 100)
                      .attr("height", 20)
                      .style("top",`${d3.mouse(this)[1] - 2}px`)
                      .style("left",`${d3.mouse(this)[0]}px`)
                      .attr("data-education", eduMap.get(d.id).bachelorsOrHigher)
                      .html(`${eduMap.get(d.id).area_name} - ${eduMap.get(d.id).bachelorsOrHigher}%`)
            })
            .on("mouseout", function(d) {
              tooltip.style("opacity", "0")
            })

  choropleth.append("path")
            .datum(topojson.mesh(countyData, countyData.objects.states, function(a,b) {return a !== b}))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-width", "2")
            .attr("d", path)

  choropleth.attr('transform', `translate(${padding},0)`)
  const legend = d3.select("#choropleth")
                    .append("svg")
                    .attr("id", "legend")
                    .attr("width", width)
                    .attr("height", padding)

  const legendColors = legend.selectAll("rect")
                              .data(range)
                              .enter()
                              .append("rect")
                              .attr("height", 20)
                              .attr("width", d=> 50)
                              .attr("fill", d => colorScale(d))
                              .attr("y", 0)
                              .attr("x", (d,i) => (i+1) * 50)

  const colorAxis = d3.axisBottom(eduScale)
  colorAxis.tickFormat(d => `${d}%`)

  legend.append("g")
        .attr("transform", `translate(0,20)`)
        .call(colorAxis)
  legend.attr("transform", `translate(${padding*2}, ${padding/2})`)
}
