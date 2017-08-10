import React, { Component } from "react";

import { Button, Modal, Form, Input, Radio } from "antd";
import { Confirm } from "semantic-ui-react";
const FormItem = Form.Item;

export default class AgentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.modal,
      //fields: this.props.fields

      currentCode: "",
      currentName: "",
      currentEmail: "",
      currentEmail2: "",
      currentTitle: "",
      currentPhoneNumber: "",
      currentPhoneNumber2: "",
      currentAgentOffice: "",
      currentPassword: "",
      confirm: false
    };
  }

  handleNameChange(e) {
    this.setState({
      currentName: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      currentPassword: e.target.value
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

  handleTitleChange(e) {
    this.setState({
      currentTitle: e.target.value
    });
  }

  handleCancel() {
    this.props.onCancel();
  }

  handleAdd() {
    var name = this.state.currentName;
    var email = this.state.currentEmail;
    var email2 = this.state.currentEmail2;
    var title = this.state.currentTitle;
    var code = this.state.currentCode;
    var phone = this.state.currentPhoneNumber;
    var phone2 = this.state.currentPhoneNumber2;
    var office = this.state.currentAgentOffice;
    var password = this.state.currentPassword;
    this.props.onOk(
      code,
      name,
      email,
      email2,
      title,
      phone,
      phone2,
      office,
      password
    );
    this.setState({
      currentName: "",
      currentEmail: "",
      currentEmail2: "",
      currentTitle: "",
      currentCode: "",
      currentPhoneNumber: "",
      currentPhoneNumber2: "",
      currentAgentOffice: "",
      currentPassword: "",
      confirm: false
    });
  }

  showConfirm() {
    this.setState({
      confirm: true
    });
  }

  handleCancelConfirm() {
    this.setState({
      confirm: false
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="Add Agent"
        okText="Add"
        cancelText="Cancel"
        onCancel={() => this.handleCancel()}
        onOk={() => this.showConfirm()}
      >
        <Form layout="vertical">
          <FormItem label="Name">
            <Input onChange={e => this.handleNameChange(e)} />
          </FormItem>
          <FormItem label="Code">
            <Input onChange={e => this.handleCodeChange(e)} />
          </FormItem>
          <FormItem label="Email">
            <Input onChange={e => this.handleEmailChange(e)} />
          </FormItem>
          <FormItem label="Email 2">
            <Input onChange={e => this.handleEmail2Change(e)} />
          </FormItem>
          <FormItem label="Title">
            <Input onChange={e => this.handleTitleChange(e)} />
          </FormItem>
          <FormItem label="Phone Number">
            <Input onChange={e => this.handlePhoneNumberChange(e)} />
          </FormItem>
          <FormItem label="Phone Number 2">
            <Input onChange={e => this.handlePhoneNumber2Change(e)} />
          </FormItem>
          <FormItem label="Agent Office">
            <Input onChange={e => this.handleAgentOfficeChange(e)} />
          </FormItem>
          <FormItem label="Password">
            <Input onChange={e => this.handlePasswordChange(e)} />
          </FormItem>
        </Form>
        <Confirm
          open={this.state.confirm}
          content="Are you sure you want to add this agent?"
          cancelButton="No"
          confirmButton="Yes"
          onCancel={() => this.handleCancelConfirm()}
          onConfirm={() => this.handleAdd()}
        />
      </Modal>
    );
  }
}
