import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import "../css/HeaderCard.css";

class HeaderCard extends Component {
  render() {
    return (
      <div>
        <Card className="card-style" id="home">
          <Card.Body>
            <Card.Title className="card-subtitle-style">Data Trends</Card.Title>
            <h1 className="card-title-style">
              Global CO<sub>2</sub> Emissions
            </h1>

            <Card.Text className="card-text-style">
              Climate change is one of the world’s most pressing challenges.
              Human emissions of greenhouse gases – carbon dioxide, nitrous
              oxide, methane, and others – have increased global temperatures by
              around 1.9ºF since pre-industrial times.
            </Card.Text>

            <a href="#dashboard">
              <Button variant="secondary" className="card-button">
                Full Story
              </Button>
            </a>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default HeaderCard;
