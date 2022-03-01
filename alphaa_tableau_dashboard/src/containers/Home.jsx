import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navcomponent from "../components/Navcomponent";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

class CustomLayout extends Component {
    constructor(props) {
        super(props);
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.append("file", this.uploadInput.files[0]);

        fetch("http://127.0.0.1:5000/upload", {
            method: "POST",
            body: data,
        }).then((response) => {
            response.json().then((body) => {
                alert(body["response"]);
                // this.setState({ imageURL: `http://127.0.0.1:5000/${body.file}` });
            });
        });
    }

    render() {
        return (
            <React.Fragment>
                <Navcomponent />
                <br />
                <Container>
                    <h3>Wecome to Alphaa - Tableau API Dashboard</h3>
                    <p>
                        This app lets you upload CSV/XLS/XLSX data to Tableau
                        Hyper API and lets you perform CRUD operations.
                    </p>
                    <p>
                        You can fetch data based on SQL query tooo!!! :') <br />
                    </p>
                </Container>
                <br />

                <Container>
                <hr/> 
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>
                                Please upload a new file for creating a Hyper
                                File{" "}
                            </Form.Label>
                            <Form.Label>
                                &nbsp;or go to <Link to="/dash">Dashboard</Link>{" "}
                                for old hyper files
                            </Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        ref={(ref) => {
                                            this.uploadInput = ref;
                                        }}
                                        type="file"
                                    />
                                    <Form.Text className="text-muted">
                                        Please upload CSV/XLS/XLSX files only.
                                    </Form.Text>
                                </Col>
                                <Col>
                                    <Button
                                        variant="success btn-sm"
                                        onClick={this.handleUpload}
                                    >
                                        Upload
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Container>
            </React.Fragment>
        );
    }
}

export default CustomLayout;
