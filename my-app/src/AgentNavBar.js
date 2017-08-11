import React, { Component } from "react";
import "antd/dist/antd.css";
import { Menu, Icon } from "antd";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import MasterTable from "./MasterTable";
import CampaignTable from "./CampaignTable";
import axios from "axios";
import "./AgentNavBar.css";

import CampaignTable2 from "./CampaignTable2";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

// Component that routes to MasterTable.js and CampaignTable2.js
// Retrieves all clients that belong to the logged in agent
// Passes the Client Data to Master Table and Campaign Table
// Props: Agent Object from App.js

export default class AgentNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      current: "contacts",
      update: false,
      allClients: []
    };
  }

  componentWillMount() {
    axios.get("/api/clients/" + this.props.agent.agentCode).then(response => {
      // console.log(response.data);
      this.setState({
        dataSource: response.data,
        allClients: response.data
      });
    });
  }

  updateClients(clients) {
    this.setState({
      allClients: clients,
      dataSource: clients
    });
  }

  handleClick(e) {
    this.setState({
      current: e.key
    });
  }

  handleMasterHighlight() {
    this.setState({
      current: "contacts"
    });
  }

  handleCampaignHighlight() {
    this.setState({
      current: "database"
    });
  }
  render() {
    console.log("nav bar data", this.state.dataSource);
    return (
      <Router>
        <div>
          <div>
            <ul>
              <li>
                <Link to="/">
                  <Icon
                    type="left"
                    color="white"
                    style={{ fontSize: 20, color: "white" }}
                  />
                </Link>
              </li>
              <li>
                <Link to="/managelists">
                  <h3 className="item">Master List</h3>
                </Link>
              </li>
              <li>
                <Link to="/managelists/campaigns">
                  <h3 className="item">Build a Campaign</h3>
                </Link>
              </li>
            </ul>
          </div>

          <Route
            exact
            path="/managelists"
            component={() =>
              <MasterTable
                dataSource={this.state.dataSource.reverse()}
                agentCode={this.props.agent.agentCode}
                agent={this.props.agent}
                updateClients={clients => this.updateClients(clients)}
              />}
          />
          <Route
            path="/managelists/campaigns"
            component={() =>
              <CampaignTable2
                dataSource={this.state.dataSource.reverse()}
                agentCode={this.props.agent.agentCode}
                agentID={this.props.agent._id}
                agent={this.props.agent}
                //allClients={this.state.dataSource}
              />}
          />
        </div>
      </Router>
    );
  }
}
