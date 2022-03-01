import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Navcomponent from "../components/Navcomponent";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

class Dash extends Component {
    constructor() {
        super();
        this.state = {
            data: [], showTable: false, tableName: "Please select a Hyper File for Table Generation",
            columns: [], rows: [], show: false, modal_id: 0
        };
        this.fetchFileInfo = this.fetchFileInfo.bind(this);
        this.fetchSQLData = this.fetchSQLData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
    }

    deleteRecord = (pk) => {
        const tableName = this.selectOption.value;
        var myParams = {
            data: tableName,
            id: pk
        };
        axios
            .post("http://127.0.0.1:5000/delete-hyper-tables-data", myParams)
            .then(response => {
                this.setState({ tableName: tableName });
                this.setState({ showTable: true });
                this.setState({
                    rows: response.data.table
                });
                this.setState({ columns: response.data.columns });
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    editRecord = (pk) => {
        this.setState({ modal_id: pk })
        this.setState({ show: true })
    }

    updateRecord = () => {
        const tableName = this.selectOption.value;
        const updateColName = this.updateSelectedOption.value;
        const colValue = this.newColValue.value;
        var myParams = {
            data: tableName,
            id: this.state.modal_id,
            col: updateColName,
            value: colValue
        };
        axios
            .post("http://127.0.0.1:5000/update-hyper-tables-data", myParams)
            .then(response => {
                this.setState({ tableName: tableName });
                this.setState({ showTable: true });
                this.setState({
                    rows: response.data.table
                });
                this.setState({ columns: response.data.columns });
                this.setState({ show: false })
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    handleClose = () => {
        this.setState({ show: false })
    }
    handleShow = () => {
        this.setState({ show: true })
    }

    fetchSQLData(ev) {
        ev.preventDefault();
        const tableName = this.selectOption.value;
        const sqlText = this.sqlText.value;
        var myParams = {
            data: tableName,
            dataSql: sqlText,
        };
        axios
            .post("http://127.0.0.1:5000/get-sql-hyper-tables-data", myParams)
            .then(response => {
                this.setState({ tableName: tableName });
                this.setState({ showTable: true });
                this.setState({
                    rows: response.data.table
                });
                this.setState({ columns: response.data.columns });
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    fetchFileInfo(ev) {
        ev.preventDefault();
        const tableName = this.selectOption.value;
        var myParams = {
            data: tableName,
        };
        axios
            .post("http://127.0.0.1:5000/get-hyper-tables-data", myParams)
            .then(response => {
                console.log(response.data)

                this.setState({ tableName: tableName });
                this.setState({ showTable: true });
                this.setState({
                    rows: response.data.table
                });
                this.setState({ columns: response.data.columns });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {
        axios
            .get(`http://127.0.0.1:5000/get-hyper-tables`)
            .then((response) => {
                this.setState({ data: response.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    render() {
        return (
            <React.Fragment>
                <Navcomponent />
                <Container>
                    <div>
                        <h3>Hyper API enabled Dashboard</h3>
                    </div>
                </Container>
                <Container>
                    <Row>
                        <Form onSubmit={this.fetchFileInfo}>
                            <Row>
                                <Col>
                                    <Form.Select
                                        className="mb-3"
                                        aria-label="Default select example"
                                        ref={(input) => (this.selectOption = input)}
                                    >
                                        <option>
                                            Select old Tableau Hyper files
                                        </option>
                                        {this.state.data.map((data) => (
                                            <option
                                                key={data.key}
                                                value={data.value}
                                            >
                                                {data.value}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Button variant="primary btn-sm" type="submit">
                                Fetch My File
							</Button>
                        </Form>
                    </Row>
                </Container>
                <br />
                <Container>
                    <hr />
                    {this.state.showTable ? (
                        <React.Fragment>
                            <h6>Selected Hyper API file is : {this.state.tableName}.hyper</h6>
                            <h6>Selected Hyper API table name is : HYPERTABLE</h6>
                            <Container>
                                <Form onSubmit={this.fetchSQLData}>
                                    <Row>
                                        <Form.Label>Input SQL Query</Form.Label>
                                        <Col>
                                            <Form.Group
                                            >
                                                <Form.Control
                                                    type="text"
                                                    ref={(input) => (this.sqlText = input)}
                                                    defaultValue={`SELECT * FROM "HYPERTABLE"`}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Button variant="secondary" type="submit">
                                                Execute Query
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button variant="primary" onClick={this.handleShow}>
                                                Insert New Record
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                            <br />
                            <Container>
                                <Table striped bordered hover size="sm" responsive>
                                    <thead>
                                        <tr>
                                            <th>Action</th>
                                            {
                                                this.state.columns.map((item) => (
                                                    <th>{item}</th>
                                                ))
                                            }
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.rows.map(item =>
                                                <tr>
                                                    <td>
                                                        <Container>
                                                            <Row>
                                                                <Col>
                                                                    <div key={item.pk} onClick={() => this.deleteRecord(item.pk)}>
                                                                        <FontAwesomeIcon icon={faTrashCan} />
                                                                    </div>
                                                                </Col>
                                                                <Col>
                                                                    <div key={item.pk} onClick={() => this.editRecord(item.pk)}>
                                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </Container>
                                                    </td>
                                                    {
                                                        item.value.map((val) => (
                                                            <td>{val}</td>
                                                        ))
                                                    }
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </Table>
                            </Container>

                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Update Column - Row ID {this.state.modal_id}</Modal.Title>
                                </Modal.Header>
                                <Form onSubmit={this.fetchFileInfo}>
                                    <Modal.Body>
                                        <Row>
                                            <Col>
                                                <Form.Select
                                                    className="mb-3"
                                                    aria-label="Default select example"
                                                    ref={(input) => (this.updateSelectedOption = input)}
                                                >
                                                    <option>
                                                        Select column to update
                                        </option>
                                                    {
                                                        this.state.columns.map((item) => (
                                                            <option
                                                                value={item}
                                                            >
                                                                {item}
                                                            </option>
                                                        ))
                                                    }
                                                </Form.Select>
                                            </Col>
                                            <Form.Label>Enter New Column Value</Form.Label>
                                            <Col>
                                                <Form.Group
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        ref={(input) => (this.newColValue = input)}
                                                        placeholder="Enter new value....Please enter correct dtype"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.handleClose}>
                                            Close
							</Button>
                                        <Button variant="primary" onClick={this.updateRecord}>
                                            Save Changes
							</Button>
                                    </Modal.Footer>
                                </Form>

                            </Modal>
                        </React.Fragment>
                    ) : (
                            <React.Fragment>{this.state.tableName}</React.Fragment>
                        )}

                </Container>
            </React.Fragment>
        );
    }
}

export default Dash;
