import React, { Component } from "react";

import { Button, Modal, Form, Input, Radio } from "antd";
const FormItem = Form.Item;

export default class AgentEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.editModal,
      //fields: this.props.fields
      agent: this.props.selectedAgent,
      currentCode: this.props.selectedAgent.agentCode,
      currentName: this.props.selectedAgent.agentName,
      currentEmail: this.props.selectedAgent.agentEmail,
      currentEmail2: this.props.selectedAgent.agentEmail2,
      currentPhoneNumber: this.props.selectedAgent.agentPhoneNumber,
      currentPhoneNumber2: this.props.selectedAgent.agentPhoneNumber2,
      currentAgentOffice: this.props.selectedAgent.agentOffice,
      currentPassword: ""
    };
  }

  handleNameChange(e) {
    this.setState({
      currentName: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      currentEmail: e.target.value
    });
  }

  handleEmail2Change(e) {
    this.setState({
      currentEmail2: e.target.value
    });
  }

  handleCodeChange(e) {
    this.setState({
      currentCode: e.target.value
    });
  }
  handlePhoneNumberChange(e) {
    this.setState({
      currentPhoneNumber: e.target.value
    });
  }

  handlePhoneNumber2Change(e) {
    this.setState({
      currentPhoneNumber2: e.target.value
    });
  }

  handleAgentOfficeChange(e) {
    this.setState({
      currentAgentOffice: e.target.value
    });
  }

  handleCancel() {
    this.props.onCancel();
  }

  handlePasswordChange(e) {
    this.setState({
      currentPassword: e.target.value
    });
  }

  handleUpdate() {
    var name = this.state.currentName;
    var email = this.state.currentEmail;
    var email2 = this.state.currentEmail2;
    var code = this.state.currentCode;
    var phone = this.state.currentPhoneNumber;
    var phone2 = this.state.currentPhoneNumber2;
    var office = this.state.currentAgentOffice;
    var password = this.state.currentPassword;
    this.props.onOk(code, name, email, email2, phone, phone2, office, password);
    this.setState({
      currentName: "",
      currentEmail: "",
      currentEmail2: "",
      currentCode: "",
      currentPhoneNumber: "",
      currentPhoneNumber2: "",
      currentAgentOffice: "",
      currentPassword: ""
    });
  }

  handleDeleteClient() {
    this.props.deleteClient();
  }

  render() {
    console.log("agent:", this.state.agent);
    return (
      <Modal
        visible={this.state.visible}
        title="Edit Client"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => this.handleCancel()}
        onOk={() => this.handleUpdate()}
      >
        <Form layout="vertical">
          <FormItem label="Name">
            <Input
              onChange={e => this.handleNameChange(e)}
              defaultValue={this.state.agent.agentName}
            />
          </FormItem>
          <FormItem label="Code">
            <Input
              onChange={e => this.handleCodeChange(e)}
              defaultValue={this.state.agent.agentCode}
            />
          </FormItem>
          <FormItem label="Email">
            <Input
              onChange={e => this.handleEmailChange(e)}
              defaultValue={this.state.agent.agentEmail}
            />
          </FormItem>
          <FormItem label="Email 2">
            <Input
              onChange={e => this.handleEmail2Change(e)}
              defaultValue={this.state.agent.agentEmail2}
            />
          </FormItem>
          <FormItem label="Phone Number">
            <Input
              onChange={e => this.handlePhoneNumberChange(e)}
              defaultValue={this.state.agent.agentPhoneNumber}
            />
          </FormItem>
          <FormItem label="Phone Number 2">
            <Input
              onChange={e => this.handlePhoneNumber2Change(e)}
              defaultValue={this.state.agent.agentPhoneNumber2}
            />
          </FormItem>
          <FormItem label="Agent Office">
            <Input
              onChange={e => this.handleAgentOfficeChange(e)}
              defaultValue={this.state.agent.agentOffice}
            />
          </FormItem>
          <FormItem label="Password">
            <Input
              onChange={e => this.handlePasswordChange(e)}
              placeholder={"Change Password"}
            />
          </FormItem>

          <Button onClick={() => this.handleDeleteClient()}>Delete</Button>
        </Form>
      </Modal>
    );
  }
}
