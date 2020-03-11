import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "../css/Navigation.css";
import logo from "../assets/earth.png";

class Navigation extends Component {
  state = {
    position: 0
  };
  componentDidMount() {
    window.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }

  listenToScroll = () => {
    const winScrool =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScrool / height;
    this.setState({
      position: scrolled
    });
  };

  render() {
    const { position } = this.state;
    const navClass = position >= 0.025 ? "darkNav" : "transparentNav";
    return (
      <div>
        <Navbar bg="dark" variant="dark" fixed="top" className={navClass}>
          <Navbar.Brand href="#home">
            {" "}
            <img
              alt=""
              src={logo}
              width="27"
              height="27"
              className="d-inline-block align-top"
            />
            &nbsp; Carbon Dioxide Emissions
          </Navbar.Brand>
          <Navbar.Collapse className="mr-auto justify-content-end">
            <Nav.Link
              href="https://github.com/Wenjing5431/co2emission"
              target="_blank"
            >
              View Code On Github
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
