import React, { Component } from "react";
import allData from "../data/all_data.csv";
import MapChart from "./MapChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import * as d3 from "d3";
import * as topojson from "topojson";
import "../css/ChartWrapper.css";
import { Container, Row, Col } from "react-bootstrap";

class ChartWrapper extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      extremeYears: "",
      currentYear: "",
      currentDataType: "",
      geoData: "",
      width: "",
      height: ""
    };

    var promises = [
      d3.json("http://unpkg.com/world-atlas@1.1.4/world/50m.json"),
      d3.csv(allData, row => {
        return {
          continent: row.Continent,
          country: row.Country,
          countryCode: row["Country Code"],
          emissions: +row["Emissions"],
          emissionsPerCapita: +row["Emissions Per Capita"],
          region: row.Region,
          year: +row.Year
        };
      })
    ];
    Promise.all(promises)
      .then(data => {
        this.ready.bind(this)(data[0], data[1]);
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  ready(mapData, data) {
    var extremeYears = d3.extent(data, d => d.year);
    var currentYear = extremeYears[0];
    var currentDataType = d3
      .select('input[name="data-type"]:checked')
      .attr("value");

    var geoData = topojson.feature(mapData, mapData.objects.countries).features;

    var width = +d3.select(".chart-container").node().offsetWidth;

    var height = 300;

    this.setState({
      data,
      extremeYears,
      currentYear,
      currentDataType,
      geoData,
      width,
      height,
      mapchart: new MapChart(this.refs.mapChart),
      piechart: new PieChart(this.refs.pieChart),
      barchart: new BarChart(this.refs.barChart)
    });

    this.state.mapchart.drawMap(
      geoData,
      data,
      currentYear,
      currentDataType,
      this.state.barchart
    );
    this.state.piechart.drawPie(data, currentYear);
    this.state.barchart.drawBar(data, currentDataType, "");

    d3.select("#year")
      .property("min", currentYear)
      .property("max", extremeYears[1])
      .property("value", currentYear)
      .on("input", () => {
        currentYear = +d3.event.target.value;
        this.state.mapchart.drawMap(
          geoData,
          data,
          currentYear,
          currentDataType
        );
        this.state.piechart.drawPie(data, currentYear);
        this.state.barchart.highlightBars(currentYear);
      });

    d3.selectAll('input[name="data-type"]').on("change", () => {
      var active = d3.select(".active").data()[0];
      var country = active ? active.properties.country : "";
      currentDataType = d3.event.target.value;
      this.state.mapchart.drawMap(geoData, data, currentYear, currentDataType);
      this.state.barchart.drawBar(data, currentDataType, country);
    });

    d3.selectAll("svg").on("mousemove touchmove", updateTooltip);

    function updateTooltip() {
      var tooltip = d3.select(".tooltip");
      var tgt = d3.select(d3.event.target);
      var isCountry = tgt.classed("country");
      var isBar = tgt.classed("bar");
      var isArc = tgt.classed("arc");
      var dataType = d3.select("input:checked").property("value");
      var units =
        dataType === "emissions"
          ? "thousand metric tons"
          : "metric tons per capita";
      var data;
      var percentage = "";
      if (isCountry) data = tgt.data()[0].properties;
      if (isArc) {
        data = tgt.data()[0].data;
        percentage = `<p>Percentage of total: ${getPercentage(
          tgt.data()[0]
        )}</p>`;
      }
      if (isBar) data = tgt.data()[0];
      tooltip
        .style("opacity", +(isCountry || isArc || isBar))
        .style("left", d3.event.pageX - tooltip.node().offsetWidth / 2 + "px")
        .style("top", d3.event.pageY - tooltip.node().offsetHeight - 10 + "px");
      if (data) {
        var dataValue = data[dataType]
          ? data[dataType].toLocaleString() + " " + units
          : "Data Not Available";
        tooltip.html(`
                <p>Country: ${data.country}</p>
                <p>${formatDataType(dataType)}: ${dataValue}</p>
                <p>Year: ${data.year ||
                  d3.select("#year").property("value")}</p>
                ${percentage}
              `);
      }
    }

    function formatDataType(key) {
      return (
        key[0].toUpperCase() + key.slice(1).replace(/[A-Z]/g, c => " " + c)
      );
    }

    function getPercentage(d) {
      var angle = d.endAngle - d.startAngle;
      var fraction = (100 * angle) / (Math.PI * 2);
      return fraction.toFixed(2) + "%";
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { width, height } = this.state;

    return (
      <div id="dashboard">
        <h2 className="dashboard-title">
          CO<sub>2</sub> Emissions in Twenty-One Years
        </h2>
        <Container className="data-dashboard">
          <Row>
            <Col sm={4} className="control-data">
              <div id="nav" className="intro-data">
                <p style={{ fontSize: "0.9em" }}>
                  This rise in global average temperature is attributed to an
                  increase in greenhouse gas emissions. In charts here we see
                  global average emissions of CO<sub>2</sub> in the atmosphere
                  over the past 21 years.
                </p>
                <p className="current-year">
                  <span className="highlight-text">Current Year:</span>{" "}
                  &nbsp;&nbsp;
                  <span id="year-val"></span>
                  <input id="year" type="range" step="1" />
                </p>
                <p className="choose-between">
                  <span className="highlight-text choose-text">
                    Choose Between:
                  </span>

                  <input
                    type="radio"
                    name="data-type"
                    value="emissions"
                    defaultChecked
                  />
                  <label>Emissions</label>
                  <input
                    type="radio"
                    name="data-type"
                    value="emissionsPerCapita"
                  />
                  <label>Emissions Per Capita</label>
                </p>
                <p className="highlight-text">
                  Click on a country to see its trends by year.
                </p>
              </div>
            </Col>
            <Col sm={8} className="map-chart-data">
              <div className="chart-container">
                <div
                  ref="mapChart"
                  style={{ width: width, height: height, marginTop: "-20px" }}
                ></div>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="sub-chart">
          <Row>
            <Col sm={6} className="piechart-card">
              <div className="chart-container ">
                <div
                  ref="pieChart"
                  style={{ width: width, height: height }}
                ></div>
              </div>
            </Col>
            <Col sm={6} className="barchart-card">
              <div className="chart-container">
                <div
                  ref="barChart"
                  style={{ width: width, height: height }}
                ></div>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="tooltip"></div>
      </div>
    );
  }
}

export default ChartWrapper;
