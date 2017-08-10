import React, { Component } from "react";
import { Form, Input, Button } from "semantic-ui-react";
import "./App.css";
import Nest from "./Nest.png";
import axios from "axios";
import { Icon, List, Grid } from "semantic-ui-react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import EditProfileForm from "./EditProfileForm.js";

class AgentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agent: this.props.agent,
      editModal: false
    };
  }

  openEditModal() {
    this.setState({
      editModal: true
    });
  }

  cancelEditModal() {
    this.setState({
      editModal: false
    });
  }

  updateAgent(agent) {
    this.cancelEditModal();
    this.props.updateAgent(agent);
  }

  render() {
    var editModal;
    if (this.state.editModal) {
      editModal = (
        <EditProfileForm
          editModal={this.state.editModal}
          onCancel={() => this.cancelEditModal()}
          onOk={agent => this.updateAgent(agent)}
          agent={this.state.agent}
        />
      );
    }
    var agent = this.state.agent;
    return (
      <div>
        {editModal}
        <Link to="/">
          <a className="home-icon">
            <Icon name="home" color="positive" size="huge" />
          </a>
        </Link>
        <div className="profile-pic">
          <img src={Nest} width={75} />
        </div>
        <div className="form-container">
          <Grid columns={3} textAlign={"center"}>
            <Grid.Row>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Name</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentName}
                </strong>
              </Grid.Column>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Email</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentEmail}
                </strong>
              </Grid.Column>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Title</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentTitle}
                </strong>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Phone Number</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentPhoneNumber}
                </strong>
              </Grid.Column>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Agent Code</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentCode}
                </strong>
              </Grid.Column>
              <Grid.Column>
                <h3 style={{ color: "#46797b" }}>Office</h3>
                <strong style={{ fontSize: "20px" }}>
                  {agent.agentOffice}
                </strong>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* <div className="form">
            <List>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Name</h2>
                  <List.Description>
                    {agent.agentName}
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Email</h2>
                  <List.Description>
                    {agent.agentEmail}
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Title</h2>
                  <List.Description>
                    {agent.agentTitle}
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Agent Code</h2>
                  <List.Description>
                    {agent.agentCode}
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Phone Number</h2>
                  <List.Description>
                    {agent.agentPhoneNumber}
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item className="form-item">
                <List.Content>
                  <h2>Agent Office</h2>
                  <List.Description>
                    {agent.agentOffice}
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </div> */}
        </div>
        <div className="edit-button">
          <Button
            content="Edit"
            onClick={() => this.openEditModal()}
            color="black"
          />
        </div>
      </div>
    );
  }
}

export default AgentProfile;

{
  /* <List.Item>
  <List.Icon name="folder" />
  <List.Content>
    <List.Header>site</List.Header>
    <List.Description>Your site's theme</List.Description>
  </List.Content>
</List.Item>; */
}
