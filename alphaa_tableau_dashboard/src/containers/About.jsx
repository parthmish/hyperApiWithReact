import React from "react";
import Container from "react-bootstrap/Container";
import Navcomponent from "../components/Navcomponent";

const About = (props) => {
    return (
        <React.Fragment>
            <Navcomponent />
            <Container>
                <h3>Wecome to Alphaa - Tableau API Dashboard</h3>
                <p>
                    Made by Parth <br />
                </p>
            </Container>
        </React.Fragment>
    );
};

export default About;
