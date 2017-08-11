// Import all dependencies
import React, { Component } from "react";
import "./App.css";
import AgentNavBar from "./AgentNavBar";
import AgentHome from "./AgentHome";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import axios from "axios";
import CreateCampaignParent from "./CreateCampaignParent";
import MediaCenter from "./MediaCenter";
import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale-provider/en_US";
import AgentProfile from "./AgentProfile";
import { Modal, Form, Input, Radio } from "antd";
import { Button } from "semantic-ui-react";
import AdminHome from "./AdminHome";
import AdminClientDirectory from "./AdminClientDirectory";
import AdminAgentDirectory from "./AdminAgentDirectory";
import ManageCampaigns from "./ManageCampaigns";
import CampaignTable2 from "./CampaignTable2";
import BodyBackgroundColor from "react-body-backgroundcolor";

//Main App component that renders the login page and handles routes depending on whether Admin or Agent logged in
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      field: "",
      password: "",
      agent: {},
      logged: false,
      updated: false,
      admin: false
    };
  }

  handleFieldChange(e) {
    this.setState({
      field: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    });
  }

  // When Agent is edited from their profile (AgentProfile.js), the update is taken place here
  updateAgent(agent) {
    var self = this;
    var updateAgent = this.state.agent;
    updateAgent = agent;
    axios.put("/api/agent/" + agent.agentCode, agent);
    self.setState({
      agent: updateAgent
    });
  }

  //Initial Validation of logging in
  validateLogin() {
    var self = this;
    var body = {
      password: this.state.password
    };
    axios
      .post(
        "/" + this.state.field.toLocaleUpperCase(),
        body
      )
      .then(response => {
        if (response.data) {
          var agent = response.data;
          var logged = true;
          var admin = false;
          if (agent.agentCode == "ADMIN") {
            admin = true;
          }
          self.setState({
            agent: agent,
            logged: logged,
            admin: admin
          });
          sessionStorage.setItem("logged", "true");
          sessionStorage.setItem("agent", agent.agentCode);
        }
      });
  }

  // Changing session storage when the logout button is clicked in the child component (AgentHome.js)
  logOut() {
    sessionStorage.setItem("agent", null);
    sessionStorage.setItem("logged", "false");
    this.setState({
      logged: false,
      admin: false
    });
  }

  // Everytime App renders, retrieve the status of whether logged in or not
  componentWillMount() {
    var logged = sessionStorage.getItem("logged");
    var agent = sessionStorage.getItem("agent");
    var self = this;
    if (logged == "true" && agent !== "ADMIN") {
      axios.get("/" + agent).then(response => {
        self.setState({
          logged: true,
          admin: false,
          agent: response.data
        });
      });
    } else if (agent == "ADMIN") {
      self.setState({
        logged: true,
        admin: true
      });
    }
  }

  render() {
    // If admin is logged in, return the Admin side of the app
    if (this.state.admin) {
      return (
        <LocaleProvider locale={enUS}>
          <Router>
            <div>
              <Route
                exact
                path="/"
                component={() => <AdminHome logOut={() => this.logOut()} />}
              />
              <Route path="/createcampaign" component={CreateCampaignParent} />
              <Route path="/clientdirectory" component={AdminClientDirectory} />
              <Route path="/agentdirectory" component={AdminAgentDirectory} />
              <Route path="/managecampaigns" component={ManageCampaigns} />
            </div>
          </Router>
        </LocaleProvider>
      );
    }

    //If no one is logged in, render the login page
    var height = window.innerHeight;
    if (!this.state.logged) {
      return (
        <div className="background" style={{ height: height }}>
          <div className="login">
            <h1 className="title" style={{ marginTop: "5%" }}>
              NEST PORTAL
            </h1>
            <div className="login-field">
              <div>
                <Input
                  onChange={e => this.handleFieldChange(e)}
                  placeholder="Enter FON Code"
                />
              </div>

              <div style={{ marginTop: "1%" }}>
                <Input
                  type="password"
                  onChange={e => this.handlePasswordChange(e)}
                  placeholder="Enter Your Password"
                />
              </div>
            </div>

            <div className="login-button-container">
              <Button
                className="login-button"
                color="black"
                onClick={() => this.validateLogin()}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      );
    }

    // If an agent is logged in, render the AgentHome Component
    if (this.state.logged) {
      return (
        <div>
          <Router>
            <div>
              <Route
                exact
                path="/"
                component={() =>
                  <AgentHome
                    agent={this.state.agent}
                    logOut={() => this.logOut()}
                  />}
              />
              <Route
                path="/managelists"
                component={() => <AgentNavBar agent={this.state.agent} />}
              />
              <Route
                path="/profile"
                component={() =>
                  <AgentProfile
                    agent={this.state.agent}
                    updateAgent={data => {
                      this.updateAgent(data);
                    }}
                  />}
              />
            </div>
          </Router>
        </div>
      );
    }
  }
}

export default App;
