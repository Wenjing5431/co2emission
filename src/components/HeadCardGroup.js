import React from "react";
import { Card, CardGroup } from "react-bootstrap";
import increase from "../assets/up-arrow.png";
import decrease from "../assets/down-arrow.png";
import "../css/HeaderCardGroup.css";

class HeaderCardGroup extends React.Component {
  state = {
    climateData: [
      {
        title: "carbon dioxide",
        increase: true,
        data: "413",
        unit: "parts per million"
      },
      {
        title: "global temperature",
        increase: true,
        data: "1.9",
        unit: "ºF since 1880"
      },
      {
        title: "arctic ice minimum",
        increase: false,
        data: "12.85",
        unit: "percent per decade"
      },
      {
        title: "ice sheets",
        increase: false,
        data: "428",
        unit: "Gigatonnes per year"
      }
    ]
  };

  render() {
    const { climateData } = this.state;

    return (
      <div>
        <CardGroup>
          {climateData.map((data, i) => {
            return (
              <Card key={i} className="group-data-style">
                <Card.Body className="group-data-body">
                  <div className="data-overlay"></div>
                  <div className="climate-data-content">
                    <Card.Title className="data-title-style">
                      {data.title}
                    </Card.Title>

                    <Card.Text className="arrow-style">
                      {data.increase ? (
                        <img src={increase} width="75%" alt="up arrow"></img>
                      ) : (
                        <img src={decrease} width="75%" alt="down arrow"></img>
                      )}
                    </Card.Text>
                    <Card.Text className="data-style">{data.data}</Card.Text>
                    <Card.Text className="unit-style">{data.unit}</Card.Text>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </CardGroup>
      </div>
    );
  }
}

export default HeaderCardGroup;
