import React, { Component } from "react";
import "antd/dist/antd.css";
import { Table, Input, Icon, Popconfirm, LocaleProvider } from "antd";
import { Button } from "semantic-ui-react";
import axios from "axios";
// import data from './data';
import ClientForm from "./Form";
import EditForm from "./EditForm";
import "./App.css";
import enUS from "antd/lib/locale-provider/en_US";

// Component for Viewing the clients of the logged in Agent
// One can add (through Form.js modal) and edit (through EditForm.js) clients

export default class MasterTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      count: 2,
      modal: false,
      editModal: false,
      selectedClient: {},
      searchText: "",
      searchData: [],
      filtered: false
    };
  }

  handleOpenModal() {
    this.setState({
      modal: true
    });
  }

  handleCloseModal() {
    this.setState({
      modal: false
    });
  }

  openEditModal(text) {
    this.setState({
      editModal: true,
      selectedClient: text
    });
  }

  closeEditModal() {
    this.setState({
      editModal: false
    });
    window.location.reload();
  }

  cancelEditModal() {
    this.setState({
      editModal: false
    });
  }

  updateClient(
    firstName,
    lastName,
    clientAddress,
    clientCity,
    clientEmail,
    clientState,
    clientBirthday,
    clientAnniversary
  ) {
    var clientId = this.state.selectedClient._id;
    var data = this.state.dataSource;
    var self = this;
    data.map(client => {
      if (client == self.state.selectedClient) {
        client.firstName = firstName;
        client.lastName = lastName;
        client.clientAddress = clientAddress;
        client.clientCity = clientCity;
        client.clientEmail = clientEmail;
        client.clientState = clientState;
        client.clientBirthday = clientBirthday;
        client.clientAnniversary = clientAnniversary;
        client.clientName = firstName + " " + lastName;
      }
    });
    axios
      .put("/api/clients/" + clientId, {
        firstName: firstName,
        lastName: lastName,
        clientAddress: clientAddress,
        clientCity: clientCity,
        clientEmail: clientEmail,
        clientState: clientState,
        clientBirthday: clientBirthday,
        homeAnniversary: clientAnniversary,
        office: this.props.agent.agentOffice,
        agent: this.props.agent
      })
      .then(res => {
        data.push(res.data);
      })
      .then(function() {
        self.props.updateClients(data);
      });

    this.closeEditModal();
  }

  handleAdd(
    firstName,
    lastName,
    clientAddress,
    clientCity,
    clientEmail,
    clientState,
    clientBirthday,
    clientAnniversary
  ) {
    var data = this.state.dataSource;
    var self = this;
    axios
      .post("/api/clients", {
        firstName: firstName,
        lastName: lastName,
        clientAddress: clientAddress,
        clientCity: clientCity,
        clientEmail: clientEmail,
        clientState: clientState,
        clientBirthday: clientBirthday,
        homeAnniversary: clientAnniversary,
        agentCode: this.props.agentCode,
        office: this.props.agent.agentOffice,
        agentName: this.props.agent.agentName,
        agentEmail: this.props.agent.agentEmail,
        agentTitle: this.props.agent.agentTitle,
        agentPhone: this.props.agent.agentPhoneNumber
      })
      .then(res => {
        data.push(res.data);
      })
      .then(function() {
        self.props.updateClients(data);
      });
    this.handleCloseModal();
  }

  deleteClient() {
    var data = this.state.dataSource;
    var self = this;
    var client;
    axios
      .delete("/api/clients/" + this.state.selectedClient._id)
      .then(res => {
        client = res.data;
        var index = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i] == client) {
            index = i;
          }
        }
        data.splice(index, 1);
      })
      .then(function() {
        self.props.updateClients(data);
      });

    this.setState({
      editModal: false
    });
  }

  compareByAlph(a, b) {
    if (a > b) {
      return -1;
    }
    if (a < b) {
      return 1;
    }
    return 0;
  }

  //search functions
  onInputChange(e) {
    this.setState({ searchText: e.target.value });
  }
  onSearch() {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      searchData: this.state.dataSource
        .map(record => {
          console.log("record", record);
          const match =
            record.clientName.match(reg) ||
            record.clientCity.match(reg) ||
            record.clientAddress.match(reg) ||
            record.clientState.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record
          };
        })
        .filter(record => !!record)
    });
  }

  handleClearSearch(event) {
    this.setState({
      filtered: false,
      searchText: ""
    });
  }
  //end search functions

  render() {
    var modal;
    if (this.state.modal) {
      modal = (
        <ClientForm
          modal={this.state.modal}
          onCancel={() => {
            this.handleCloseModal();
          }}
          onOk={(
            firstName,
            lastName,
            clientAddress,
            clientCity,
            clientEmail,
            clientState,
            clientBirthday,
            clientAnniversary
          ) =>
            this.handleAdd(
              firstName,
              lastName,
              clientAddress,
              clientCity,
              clientEmail,
              clientState,
              clientBirthday,
              clientAnniversary
            )}
        />
      );
    }

    var editModal;

    if (this.state.editModal) {
      editModal = (
        <EditForm
          editModal={this.state.editModal}
          onCancel={() => this.cancelEditModal()}
          onOk={(
            clientName,
            firstName,
            lastName,
            clientAddress,
            clientCity,
            clientEmail,
            clientState,
            clientBirthday,
            clientAnniversary
          ) =>
            this.updateClient(
              clientName,
              firstName,
              lastName,
              clientAddress,
              clientCity,
              clientEmail,
              clientState,
              clientBirthday,
              clientAnniversary
            )}
          selectedClient={this.state.selectedClient}
          deleteClient={() => {
            this.deleteClient();
          }}
        />
      );
    }
    const columns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        key: "clientName",
        width: "25%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientName, b.clientName);
        }
      },
      {
        title: "Client Address",
        dataIndex: "clientAddress",
        key: "clientAddress",
        width: "25%"
      },
      {
        title: "Client City",
        dataIndex: "clientCity",
        key: "clientCity",
        width: "25%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientCity, b.clientCity);
        }
      },
      {
        title: "Client State",
        dataIndex: "clientState",
        key: "clientState",
        width: "10%"
      },
      {
        title: "Edit",
        dataIndex: "_id",
        key: "_id",
        render: (record, text, index) => {
          return (
            <a style={{ color: "#46797b" }}>
              <Icon
                type="edit"
                style={{ fontSize: 16 }}
                onClick={() => {
                  this.openEditModal(text);
                }}
              />
            </a>
          );
        }
      }
    ];
    return (
      <div className="master">
        <h2 style={{ margin: "auto" }}>Your List of Clients</h2>
        <div style={{ margin: "auto", marginTop: "1%" }}>
          <Button onClick={() => this.handleOpenModal()} width="4" color="grey">
            Add Client
          </Button>
        </div>
        <br />
        <div className="master-title">
          <div style={{ margin: "auto", width: "40%" }}>
            <Input
              ref={ele => (this.searchInput = ele)}
              placeholder="Search by name, address, city, or state"
              value={this.state.searchText}
              onChange={e => this.onInputChange(e)}
              onPressEnter={() => this.onSearch()}
            />
          </div>
        </div>
        <div style={{ margin: "auto" }}>
          <Button type="primary" size="mini" onClick={() => this.onSearch()}>
            Search
          </Button>
          <Button onClick={event => this.handleClearSearch(event)} size="mini">
            Clear Search
          </Button>
        </div>
        {modal}
        {editModal}
        <div className="master-table">
          <LocaleProvider locale={enUS}>
            <Table
              bordered
              dataSource={
                this.state.filtered
                  ? this.state.searchData
                  : this.state.dataSource
              }
              columns={columns}
              pagination={false}
              scroll={{ y: 350 }}
            />
          </LocaleProvider>
        </div>
      </div>
    );
  }
}
