import * as d3 from "d3";

var width;
var height;
const margin = { top: 50, bottom: 150, left: 0, right: 0 };

export default class MapChart {
  constructor(element) {
    width = element.offsetWidth + margin.left + margin.right;
    height = 300 + margin.top + margin.bottom;

    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    this.svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", "1em")
      .attr("font-size", "1.2em")
      .attr("font-family", "Open Sans")
      .style("text-anchor", "middle")
      .style("fill", "#031327")
      .classed("map-title", true);
  }

  drawMap = (geoData, climateData, year, dataType, barchart) => {
    var map = this.svg;

    var bar = barchart;

    var projection = d3
      .geoMercator()
      .scale(110)
      .translate([+map.attr("width") / 2, +map.attr("height") / 1.4]);

    var path = d3.geoPath().projection(projection);

    d3.select("#year-val").text(year);

    geoData.forEach(d => {
      var countries = climateData.filter(row => row.countryCode === d.id);
      var name = "";
      if (countries.length > 0) name = countries[0].country;
      d.properties = countries.find(c => c.year === year) || { country: name };
    });

    var colors = ["#f1c40f", "#e67e22", "#e74c3c", "#c0392b"];

    var domains = {
      emissions: [0, 2.5e5, 1e6, 5e6],
      emissionsPerCapita: [0, 0.5, 2, 10]
    };

    var mapColorScale = d3
      .scaleLinear()
      .domain(domains[dataType])
      .range(colors);

    var update = map.selectAll(".country").data(geoData);

    update
      .enter()
      .append("path")
      .classed("country", true)
      .attr("d", path)

      .on("click", function() {
        var currentDataType = d3.select("input:checked").property("value");
        var country = d3.select(this);
        var isActive = country.classed("active");
        var countryName = isActive ? "" : country.data()[0].properties.country;
        bar.drawBar(climateData, currentDataType, countryName);
        bar.highlightBars(+d3.select("#year").property("value"));
        d3.selectAll(".country").classed("active", false);
        country.classed("active", !isActive);
      })
      .merge(update)
      .transition()
      .duration(750)
      .attr("fill", d => {
        var val = d.properties[dataType];
        return val ? mapColorScale(val) : "#ccc";
      });

    d3.select(".map-title").text(
      "Carbon dioxide " + graphTitle(dataType) + ", " + year
    );
  };
}

function graphTitle(str) {
  return str.replace(/[A-Z]/g, c => " " + c.toLowerCase());
}
