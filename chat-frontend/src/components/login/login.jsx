import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Container } from "react-bootstrap";
import "./login.css";
import io from "socket.io-client";
import logo from "./chatImg.jpg";
import loader from "./loader2.gif";
const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io("https://chatio-backend.herokuapp.com/", connOpt); //socket instance
class Login extends Component {
  state = {
    logged: false,
    name: "",
    password: "",
    registering: false,
  };
  saveTokensLocally = (data1) => {
    console.log(data1);
    const data = data1[0];
    console.log("TOKENS", data);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", this.state.name);
    this.setState({ logged: true });
    socket.emit("login", data1[1]);
    window.location = "/chat";
  };
  login = async () => {
    console.log(process.env.REACT_APP_URL);
    const url = process.env.REACT_APP_URL + "/profiles/login";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
      }),
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => this.saveTokensLocally(data));
  };
  register = async () => {
    this.setState({ registering: true });
    const url = process.env.REACT_APP_URL + "/profiles/register";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.name,
        password: this.state.password,
        online: false,
      }),
    };
    await fetch(url, requestOptions).then((response) => response.json());
    const that = this;
    setTimeout(function () {
      that.setState({ registering: false });
    }, 1100);
  };
  render() {
    return (
      <>
        <Container className="modalLogin" show={this.state.show}>
          <Row className="logoRow d-flex justify-content-center mb-1">
            <img src={logo} />
          </Row>{" "}
          {this.state.registering ? ( <>
            <Row className="loaderRow d-flex justify-content-center ">
              {" "}
              <img src={loader} />{" "}
            </Row>
              <Row className="logoRow d-flex justify-content-center mb-4">Registering...</Row>
              </>
          ) : (
            <>
              <Row className="question1 d-flex justify-content-center">
                {" "}
                Name
              </Row>
              <Row className="answerRow d-flex justify-content-center">
                <input
                  className="loginTextArea name"
                  onChange={(e) =>
                    this.setState({ name: e.currentTarget.value })
                  }
                />
              </Row>{" "}
              <Row className="question1 d-flex justify-content-center mt-3">
                {" "}
                Password
              </Row>
              <Row className="answerRow d-flex justify-content-center mb-5">
                <input
                  className="loginTextArea name"
                  type="password"
                  onChange={(e) =>
                    this.setState({ password: e.currentTarget.value })
                  }
                />
              </Row>{" "}
            </>
          )}
          <Row className="answerRow d-flex justify-content-center mb-2">
            <h className="applyBtn" onClick={() => this.login()}>
              Login{" "}
            </h>
          </Row>
          <Row className="d-flex justify-content-center mb-2">
            <h className="d-flex justify-content-center">Or</h>
          </Row>
          <Row className="answerRow d-flex justify-content-center mb-4">
            <h className="applyBtn" onClick={() => this.register()}>
              Register{" "}
            </h>
          </Row>
          <Row className="question1 d-flex justify-content-center ">
            {" "}
            <h className=" d-flex justify-content-center">
              {" "}
              * If you do not have an account first click on register and then
              on login{" "}
            </h>
          </Row>
        </Container>
      </>
    );
  }
}
export default Login;
