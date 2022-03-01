import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import About from "./containers/About";
import Dash from "./containers/Dash";
import CustomLayout from "./containers/Home";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<CustomLayout/>} />
            <Route exact path="/dash" element={<Dash/>} />
            <Route exact path="/about" element={<About/>} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
