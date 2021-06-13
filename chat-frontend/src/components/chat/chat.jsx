import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Row, Container } from "react-bootstrap";
import "./chat.css";
import logo from "./chatImg.jpg" 
import io from "socket.io-client";
const connOpt = {
  transports: ["websocket"], // socket connectin options
};

let socket = io("https://chatio-backend.herokuapp.com/", connOpt); //socket instance
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      onlineProfiles: [],
      msg: "",
      to: "",
      convo: [],
      showConvos: false,
    };
  }
  loadPreviousConvo = async (name) => {
    const url = process.env.REACT_APP_URL + "/convos/getConvo";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        to: name,
        message: this.state.msg,
      }),
    })
      .then((response) => response.json())
      .then((data) => this.setState({ convo: data.messages }));
    this.setState({ to: name });
  };
 
  logOut = async (id) => {
    console.log(process.env.REACT_APP_URL);
    const url = process.env.REACT_APP_URL + "/profiles/logOut";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    await fetch(url, requestOptions);
    socket.emit("logOut", localStorage.getItem("username"));
    window.location = "/login";
  };
  sendMsg = async () => {
    const url = process.env.REACT_APP_URL + "/convos/sendMsg";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        from: localStorage.getItem("username"),
        to: this.state.to,
        message: this.state.msg,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
    socket.emit("sendMsg", {
      //emitting an event with a payload to send the message to all connected users
      from: localStorage.getItem("username"),
      to: this.state.to,
      message: this.state.msg,
    });
  };
  componentWillUnmount = async () => {
    await this.logOut()
   }
  componentDidMount = async () => {
    socket.on("sendMsg", (msg) =>
      this.setState({ convo: this.state.convo.concat(msg) })
    );
    socket.on("login", (user) =>
      this.setState({ onlineProfiles: this.state.onlineProfiles.concat(user) })
    );
    socket.on("logOut", (name) =>
      this.setState({
        onlineProfiles: this.state.onlineProfiles.filter(
          (profile) => profile.name !== name
        ),
      })
    );
    //listening to any event of type "sendMsg" and reacting by calling the function
    //that will append a new message to the "messages" array
    const url = process.env.REACT_APP_URL + "/profiles/getOnlineProfiles";
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ onlineProfiles: data }));
  };

  render() {
    return (
      <>
        <h className="welcome d-flex justify-content-left">
          Welcome, {localStorage.getItem("username")}
        </h>
        <p className="welcome2" onClick={() => this.logOut()}>
          LogOut
        </p>
        <Row className="logoRow d-flex justify-content-center ">
          <img src={logo} />
          </Row>{" "}
        <h className="pplOnline d-flex justify-content-center">
          People Online{" "}
        </h>
        <Container className="onlineProfiles">
          {this.state.onlineProfiles
            .filter(
              (profile) => profile.name !== localStorage.getItem("username")
            )
            .map((profile) => (
              <Row
                className="profileRow d-flex justify-content-center"
                onClick={() => this.loadPreviousConvo(profile.name)}
              >
                <p className="onlineUser">
                  <h>{profile.name}</h>
                </p>
              </Row>
            ))}
        </Container>
        <h className="chatHeading">
          {" "}
          {this.state.to === ""
            ? "Select someone to chat with"
            : "Your chat with " + this.state.to}{" "}
        </h>
        <Container className="chatContainer mt-3">
          {this.state.convo.map((msg) => (
            <Row>
              <p
                className={
                  msg.from === localStorage.getItem("username")
                    ? "msgRowMe"
                    : "visually-hidden"
                }
              >
                <h className="borderClass">{msg.message}</h>
              </p>
              <p
                className={
                  msg.from === localStorage.getItem("username")
                    ? "visually-hidden"
                    : " msgRow "
                }
              >
                <h className="borderClass2">{msg.message}</h>
              </p>
            </Row>
          ))}
          {this.state.to !== "" ? (
            <>
              <Row className="d-flex justify-content-center mt-3">
                <input
                  className="msgInput"
                  onChange={(e) =>
                    this.setState({ msg: e.currentTarget.value })
                  }
                  placeholder="type here"
                />
              </Row>
              <Row className="d-flex justify-content-center mt-1">
                <h className="sendMsgBtn" onClick={() => this.sendMsg()}>
                  {" "}
                  Send{" "}
                </h>
              </Row>
            </>
          ) : (
            <> </>
          )}
        </Container>
        .
      </>
    );
  }
}
export default Chat;
