import React, { Component } from "react";

import { Button, Modal, Form, Input, Radio } from "antd";
import { Confirm } from "semantic-ui-react";
const FormItem = Form.Item;

export default class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.editModal,
      //fields: this.props.fields
      client: this.props.selectedClient,
      currentName: this.props.selectedClient.clientName,
      currentFirst: this.props.selectedClient.firstName,
      currentLast: this.props.selectedClient.lastName,
      currentAddress: this.props.selectedClient.clientAddress,
      currentCity: this.props.selectedClient.clientCity,
      currentEmail: this.props.selectedClient.clientEmail,
      currentState: this.props.selectedClient.clientState,
      currentBirthday: this.props.selectedClient.clientBirthday,
      currentAnniversary: this.props.selectedClient.homeAnniversary,
      confirm: false,
      deleteConfirm: false
    };
  }

  handleNameChange(e) {
    this.setState({
      currentName: e.target.value
    });
  }

  handleFirstChange(e) {
    this.setState({
      currentFirst: e.target.value
    });
  }

  handleLastChange(e) {
    this.setState({
      currentLast: e.target.value
    });
  }

  handleAddressChange(e) {
    this.setState({
      currentAddress: e.target.value
    });
  }

  handleStateChange(e) {
    this.setState({
      currentState: e.target.value
    });
  }

  handleCityChange(e) {
    this.setState({
      currentCity: e.target.value
    });
  }

  handleEmailChange(e) {
    this.setState({
      currentEmail: e.target.value
    });
  }
  handleBirthdayChange(e) {
    this.setState({
      currentBirthday: e.target.value
    });
  }

  handleAnniversaryChange(e) {
    this.setState({
      currentAnniversary: e.target.value
    });
  }
  handleCancel() {
    this.props.onCancel();
  }

  handleUpdate() {
    var first = this.state.currentFirst;
    var last = this.state.currentLast;
    if (first == undefined && last == undefined) {
      first = this.state.currentName;
      last = "";
    }
    var address = this.state.currentAddress;
    var city = this.state.currentCity;
    var birthday = this.state.currentBirthday;
    var email = this.state.currentEmail;
    var state = this.state.currentState;
    var anniversary = this.state.currentAnniversary;
    this.props.onOk(
      first,
      last,
      address,
      city,
      email,
      state,
      birthday,
      anniversary
    );
    this.setState({
      currentName: "",
      currentFirst: "",
      currentLast: "",
      currentAddress: "",
      currentCity: "",
      currentEmail: "",
      currentState: "",
      currentBirthday: "",
      currentAnniversary: ""
    });
  }

  handleDeleteClient() {
    this.props.deleteClient();
  }

  showConfirm() {
    this.setState({
      confirm: true
    });
  }

  handleCancelEditConfirm() {
    this.setState({
      confirm: false
    });
  }

  handleCancelDeleteConfirm() {
    this.setState({
      deleteConfirm: false
    });
  }

  showDeleteConfirm() {
    this.setState({
      deleteConfirm: true
    });
  }

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="Edit Client"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => this.handleCancel()}
        onOk={() => this.showConfirm()}
      >
        <Form layout="vertical">
          <FormItem label="First Name">
            <Input
              onChange={e => this.handleFirstChange(e)}
              defaultValue={this.state.client.firstName}
            />
          </FormItem>
          <FormItem label="Last Name">
            <Input
              onChange={e => this.handleLastChange(e)}
              defaultValue={this.state.client.lastName}
            />
          </FormItem>
          <FormItem label="Address">
            <Input
              onChange={e => this.handleAddressChange(e)}
              defaultValue={this.state.client.clientAddress}
            />
          </FormItem>
          <FormItem label="City">
            <Input
              onChange={e => this.handleCityChange(e)}
              defaultValue={this.state.client.clientCity}
            />
          </FormItem>
          <FormItem label="Email">
            <Input
              onChange={e => this.handleEmailChange(e)}
              defaultValue={this.state.client.clientEmail}
            />
          </FormItem>
          <FormItem label="State">
            <Input
              onChange={e => this.handleStateChange(e)}
              defaultValue={this.state.client.clientState}
            />
          </FormItem>
          <FormItem label="Birthday">
            <Input
              onChange={e => this.handleBirthdayChange(e)}
              defaultValue={this.state.client.clientBirthday}
            />
          </FormItem>
          <FormItem label="Home Anniversary">
            <Input
              onChange={e => this.handleAnniversaryChange(e)}
              defaultValue={this.state.client.homeAnniversary}
            />
          </FormItem>
          <Button onClick={() => this.showDeleteConfirm()}>Delete</Button>
        </Form>
        <Confirm
          open={this.state.confirm}
          content="Are you sure you want to edit this client?"
          cancelButton="No"
          confirmButton="Yes"
          onCancel={() => this.handleCancelEditConfirm()}
          onConfirm={() => this.handleUpdate()}
        />
        <Confirm
          open={this.state.deleteConfirm}
          content="Are you sure you want to delete this client?"
          cancelButton="No"
          confirmButton="Yes"
          onCancel={() => this.handleCancelDeleteConfirm()}
          onConfirm={() => this.handleDeleteClient()}
        />
      </Modal>
    );
  }
}
