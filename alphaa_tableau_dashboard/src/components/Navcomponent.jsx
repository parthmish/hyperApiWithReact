import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Container from "react-bootstrap/Container";

const Navcomponent = (props) => {
    return (
        <React.Fragment>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>
                        Alphaa.ai - Tableau Hyper API Dash
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Container>
                                <Navbar.Brand>
                                    <Link to="/">Home</Link>
                                </Navbar.Brand>
                                <Navbar.Brand>
                                    <Link to="/dash">Dashboard</Link>
                                </Navbar.Brand>
                                <Navbar.Brand>
                                    <Link to="/about">About</Link>
                                </Navbar.Brand>
                            </Container>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    );
};

export default Navcomponent;
