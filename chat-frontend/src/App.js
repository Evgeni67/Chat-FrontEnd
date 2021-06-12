import "./App.css";
import Login from "./components/login/login";
import Chat from "./components/chat/chat";
import React, { Component } from "react";
import { BrowserRouter as Router,  Route } from "react-router-dom";
class App extends Component {
  render() {
    return (
      <div className="ChatApp">
        <Router>
          <Route path="/login">
            {" "}
            <Login />{" "}
          </Route>
          <Route path="/chat">
            {" "}
            <Chat />{" "}
          </Route>
        </Router>
      </div>
    );
  }
}

export default App;
