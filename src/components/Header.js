import React, { Component } from "react";
import { Jumbotron, Container } from "react-bootstrap";
import HeaderCard from "./HeaderCard";
import HeadCardGroup from "./HeadCardGroup";
import "../css/Header.css";

class Header extends Component {
  render() {
    return (
      <div>
        <Jumbotron fluid className="header-style">
          <Container>
            <HeaderCard />
          </Container>
        </Jumbotron>
        <HeadCardGroup />
      </div>
    );
  }
}

export default Header;
