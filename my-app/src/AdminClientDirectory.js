import React, { Component } from "react";
import { Table, Tabs, Button, Input, Icon } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import "./AdminDirectory.css";
import EditForm from "./EditForm";
const TabPane = Tabs.TabPane;

export default class AdminClientDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
      data: [],
      officeData: [],
      searchText: "",
      searchData: [],
      filtered: false,
      editModal: false
    };
  }

  //start search functions
  onInputChange(e) {
    this.setState({ searchText: e.target.value });
  }
  onSearch() {
    const { searchText } = this.state;
    const reg = new RegExp(searchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      searchData: this.state.officeData
        .map(record => {
          const match = record.clientName.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
                {record.clientName.split(reg).map(
                  (text, i) =>
                    i > 0
                      ? [
                          <span className="highlight">
                            {match[0]}
                          </span>,
                          text
                        ]
                      : text
                )}
              </span>
            )
          };
        })
        .filter(record => !!record)
    });
  }
  //end search functions

  componentWillMount() {
    axios.get("/api/clients").then(res => {
      this.setState({
        data: res.data,
        officeData: res.data.filter(client => {
          return "asheville" === client.office.toLowerCase();
        })
      });
    });
  }

  handleTabClick(key) {
    var data = this.state.data;
    this.setState({
      officeData: data.filter(client => {
        return key === client.office.toLowerCase();
      }),
      searchData: [],
      filtered: false,
      searchText: ""
    });
  }

  openEditModal(text) {
    console.log(text);
    this.setState({
      editModal: true,
      selectedClient: text
    });
  }

  updateClient(
    clientName,
    clientAddress,
    clientCity,
    clientEmail,
    clientState,
    clientBirthday,
    clientAnniversary
  ) {
    var clientId = this.state.selectedClient._id;
    axios.put("/api/clients/" + clientId, {
      clientName: clientName,
      clientAddress: clientAddress,
      clientCity: clientCity,
      clientEmail: clientEmail,
      clientState: clientState,
      clientBirthday: clientBirthday,
      homeAnniversary: clientAnniversary
    });
    this.closeEditModal();
  }

  closeEditModal() {
    this.setState({
      editModal: false
    });
  }

  deleteClient() {
    axios.delete("/api/clients/" + this.state.selectedClient._id);
    this.setState({
      editModal: false
    });
  }

  render() {
    var editModal;
    if (this.state.editModal) {
      editModal = (
        <EditForm
          editModal={this.state.editModal}
          onCancel={() => this.closeEditModal()}
          onOk={(
            clientName,
            clientAddress,
            clientCity,
            clientEmail,
            clientState,
            clientBirthday,
            clientAnniversary
          ) =>
            this.updateClient(
              clientName,
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

    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};

    const columns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        width: 150,
        sorter: function(a, b) {
          var nameA = a.clientName.toLowerCase(),
            nameB = b.clientName.toLowerCase();
          if (
            nameA < nameB //sort string ascending
          )
            return -1;
          if (nameA > nameB) return 1;
          return 0; //default return value (no sorting)
        },
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={this.state.searchText}
              onChange={e => this.onInputChange(e)}
              onPressEnter={() => this.onSearch()}
            />
            <Button type="primary" onClick={() => this.onSearch()}>
              Search
            </Button>
          </div>
        ),
        filterIcon: (
          <Icon
            type="search"
            style={{ color: this.state.filtered ? "#108ee9" : "#aaa" }}
          />
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible
            },
            () => this.searchInput.focus()
          );
        }
      },
      {
        title: "Street",
        dataIndex: "clientAddress",
        width: 150
      },
      {
        title: "City",
        dataIndex: "clientCity",
        width: 150,
        sorter: function(a, b) {
          var nameA = a.clientCity.toLowerCase(),
            nameB = b.clientCity.toLowerCase();
          if (
            nameA < nameB //sort string ascending
          )
            return -1;
          if (nameA > nameB) return 1;
          return 0; //default return value (no sorting)
        }
      },
      {
        title: "Email",
        dataIndex: "clientEmail",
        width: 150
      },
      {
        title: "Birthday",
        dataIndex: "clientBirthday",
        width: 150,
        sorter: function(a, b) {
          return new Date(b.date) - new Date(a.date);
        }
      },
      {
        title: "Home Anniversary",
        dateIndex: "homeAnniversary",
        width: 150
      },
      {
        title: "Edit",
        key: "action",
        render: (text, record) =>
          <span>
            <Icon
              type="edit"
              onClick={() => {
                this.openEditModal(text);
              }}
            />
          </span>
      }
    ];

    return (
      <div>
        <div className="header">
          {editModal}
          <Link to="/">
            <Icon type="arrow-left" style={{ fontSize: 30, color: "white" }} />
          </Link>
          <h1 className="agentDirectory">Client Directory</h1>
          <br />
        </div>
        <Tabs
          defaultActiveKey="Asheville"
          onChange={key => this.handleTabClick(key)}
        >
          <TabPane tab="Asheville" key="asheville" />
          <TabPane tab="Charlottesville" key="charlottesville" />
          <TabPane tab="Fredericksburg" key="fredericksburg" />
          <TabPane tab="Lake Norman" key="lake norman" />
          <TabPane tab="New River Valley" key="new river valley" />
          <TabPane tab="Richmond" key="richmond" />
          <TabPane tab="NOVA" key="northern virginia" />
          <TabPane tab="Shenandoah Valley" key="shenandoah valley" />
          <TabPane tab="The Triangle" key="the triangle" />
          <TabPane tab="Wilmington" key="wilmington" />
        </Tabs>
        <Table
          //one table renders data depending on the office tab that is selected
          columns={columns}
          dataSource={
            this.state.filtered ? this.state.searchData : this.state.officeData
          }
          pagination={false}
          scroll={{ y: 600 }}
        />
      </div>
    );
  }
}
