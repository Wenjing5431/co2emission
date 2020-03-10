import * as d3 from "d3";

var width;
var height;

export default class PieChart {
  constructor(element) {
    width = element.offsetWidth;
    height = 300;

    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    this.svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2 + 10})`)
      .classed("chart", true);

    this.svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1em")
      .attr("font-family", "Open Sans")
      .style("text-anchor", "middle")
      .style("fill", "#031327")
      .classed("pie-title", true);
  }

  drawPie = (data, currentYear) => {
    var pie = this.svg;

    var arcs = d3
      .pie()
      .sort((a, b) => {
        if (a.continent < b.continent) return -1;
        if (a.continent > b.continent) return 1;
        return a.emissions - b.emissions;
      })
      .value(d => d.emissions);

    var path = d3
      .arc()
      .outerRadius(+pie.attr("height") / 2 - 50)
      .innerRadius(0);

    var yearData = data.filter(d => d.year === currentYear);
    var continents = [];
    for (var i = 0; i < yearData.length; i++) {
      var continent = yearData[i].continent;
      if (!continents.includes(continent)) {
        continents.push(continent);
      }
    }

    var colorScale = d3
      .scaleOrdinal()
      .domain(continents)
      .range(["#FFCD00", "#A3D6D8", "#FFA772", "#676766", "#A4A8AA"]);

    var update = pie
      .select(".chart")
      .selectAll(".arc")
      .data(arcs(yearData));

    update.exit().remove();

    update
      .enter()
      .append("path")
      .classed("arc", true)
      .attr("stroke", "#dff1ff")
      .attr("stroke-width", "0.25px")
      .merge(update)
      .attr("fill", d => colorScale(d.data.continent))
      .attr("d", path);

    pie
      .select(".pie-title")
      .text("Total emissions by continent and region, " + currentYear);
  };
}
