import React, { Component } from "react";
import "./AgentHome.css";
import Nest from "./Nest.png";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Modal, Form, Input, Radio } from "antd";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import AgentForm from "./AgentProfile";
import AgentNavBar from "./AgentNavBar";
import axios from "axios";

// Parent Component: App.js
// No Props are passed
// Only Links that can be routed to the following Components:
// AgentProfile.js, AgentNavBar.js

export default class AgentHome extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div className="home-agent">
          <div className="profile-container">
            <div className="profile">
              <Link to="/profile">
                <a className="edit-icon">
                  <Icon name="edit" size="huge" />
                </a>
              </Link>
              <text className="name">
                <strong>
                  {this.props.agent.agentName}{" "}
                </strong>
              </text>
            </div>
          </div>
          <div className="center-container">
            <div className="center-column">
              <img src={Nest} width={75} />
              <div className="manage">
                <Link to="/managelists">
                  <div className="spaceAroundButton">
                    <button className="btn">Manage Lists</button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="logout-container">
            <div className="log-out-button">
              <Button color="grey" onClick={() => this.props.logOut()}>
                <text className="logout-text">Log Out</text>
              </Button>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
