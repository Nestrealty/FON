import React, { Component } from "react";
import { Table, Tabs, Button, Input, Icon } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import "./AdminDirectory.css";
import AgentEditForm from "./AgentEditForm";
import AgentForm from "./AgentForm";
const TabPane = Tabs.TabPane;

export default class AdminAgentDirectory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
      data: [],
      officeData: [],
      searchText: "",
      filtered: false,
      searchData: [],
      editModal: false,
      selectedAgent: {},
      modal: false
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
          const match = record.agentName.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
                {record.agentName.split(reg).map(
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
    axios.get("http://localhost:4000/api/agents").then(res => {
      console.log(res.data);
      this.setState({
        data: res.data,
        officeData: res.data.filter(agent => {
          return "Asheville" === agent.agentOffice;
        })
      });
    });
  }

  handleTabClick(key) {
    var data = this.state.data;
    this.setState({
      officeData: data.filter(agent => {
        return key === agent.agentOffice;
      })
    });
  }

  handleTabClick(key) {
    var data = this.state.data;
    this.setState({
      officeData: data.filter(agent => {
        return key === agent.agentOffice;
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
      selectedAgent: text
    });
  }

  updateAgent(
    agentCode,
    agentName,
    agentEmail,
    agentEmail2,
    agentPhoneNumber,
    agentPhoneNumber2,
    agentOffice,
    password
  ) {
    var agentId = this.state.selectedAgent._id;

    axios
      .put(
        "http://localhost:4000/api/agent/password/" +
          this.state.selectedAgent.agentCode,
        {
          // agentCode: agentCode,
          agentName: agentName,
          agentEmail: agentEmail,
          agentEmail2: agentEmail2,
          agentPhoneNumber: agentPhoneNumber,
          agentPhoneNumber2: agentPhoneNumber2,
          agentOffice: agentOffice,
          password: password
        }
      )
      .then(res => {
        console.log("Updated", res.data);
      });
    this.closeEditModal();
  }

  closeEditModal() {
    this.setState({
      editModal: false
    });
  }

  deleteAgent() {
    axios.delete(
      "http://localhost:4000/api/agent/" + this.state.selectedAgent.agentCode
    );
    this.setState({
      editModal: false
    });
  }

  addAgent(
    agentCode,
    agentName,
    agentEmail,
    agentEmail2,
    agentTitle,
    agentPhoneNumber,
    agentPhoneNumber2,
    agentOffice,
    password
  ) {
    var data = {
      agentCode: agentCode,
      agentEmail: agentEmail,
      agentEmail2: agentEmail2,
      agentName: agentName,
      agentTitle: agentTitle,
      agentPhoneNumber: agentPhoneNumber,
      agentPhoneNumber2: agentPhoneNumber2,
      agentOffice: agentOffice,
      password: password
    };

    axios.post("http://localhost:4000/api/agent/new", data);
    this.setState({
      modal: false
    });
  }

  closeModal() {
    this.setState({
      modal: false
    });
  }

  openModal() {
    this.setState({
      modal: true
    });
  }
  render() {
    var modal;
    if (this.state.modal) {
      modal = (
        <AgentForm
          modal={this.state.modal}
          onCancel={() => this.closeModal()}
          onOk={(
            agentCode,
            agentName,
            agentEmail,
            agentEmail2,
            agentTitle,
            agentPhoneNumber,
            agentPhoneNumber2,
            agentOffice,
            password
          ) =>
            this.addAgent(
              agentCode,
              agentName,
              agentEmail,
              agentEmail2,
              agentTitle,
              agentPhoneNumber,
              agentPhoneNumber2,
              agentOffice,
              password
            )}
        />
      );
    }

    var editModal;
    if (this.state.editModal) {
      editModal = (
        <AgentEditForm
          editModal={this.state.editModal}
          onCancel={() => this.closeEditModal()}
          onOk={(
            agentCode,
            agentName,
            agentEmail,
            agentEmail2,
            agentPhoneNumber,
            agentPhoneNumber2,
            agentOffice,
            password
          ) =>
            this.updateAgent(
              agentCode,
              agentName,
              agentEmail,
              agentEmail2,
              agentPhoneNumber,
              agentPhoneNumber2,
              agentOffice,
              password
            )}
          selectedAgent={this.state.selectedAgent}
          deleteAgent={() => {
            this.deleteAgent();
          }}
        />
      );
    }
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [
      {
        title: "Agent Name",
        dataIndex: "agentName",
        width: 150,
        sorter: function(a, b) {
          var nameA = a.agentName.toLowerCase(),
            nameB = b.agentName.toLowerCase();
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
            <Button type="primary" onClick={this.onSearch}>
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
        title: "Code",
        dataIndex: "agentCode",
        width: 150,
        sorter: function(a, b) {
          var nameA = a.agentCode.toLowerCase(),
            nameB = b.agentCode.toLowerCase();
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
        dataIndex: "agentEmail",
        width: 150
      },
      {
        title: "Phone",
        dataIndex: "agentPhoneNumber",
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
          {modal}
          <Link to="/">
            <Icon type="arrow-left" style={{ fontSize: 30, color: 'white' }} />
          </Link>
          
          <h1 className="agentDirectory">Agent Directory</h1>
          <Button onClick={() => this.openModal()}>Add Agent</Button>
         
        </div>

        <Tabs
          defaultActiveKey="Asheville"
          onChange={key => this.handleTabClick(key)}
        >
          <TabPane tab="Asheville" key="Asheville" />
          <TabPane tab="Charlottesville" key="Charlottesville" />
          <TabPane tab="Fredericksburg" key="Fredericksburg" />
          <TabPane tab="Lake Norman" key="Lake Norman" />
          <TabPane tab="New River Valley" key="New River Valley" />
          <TabPane tab="Richmond" key="Richmond" />
          <TabPane tab="Shenandoah Valley" key="Shenandoah Valley" />
          <TabPane tab="The Triangle" key="The Triangle" />
          <TabPane tab="Wilmington" key="Wilmington" />
        </Tabs>
        <Table
        //one table renders data depending on the office tab that is selected
          columns={columns}
          dataSource={
            this.state.filtered ? this.state.searchData : this.state.officeData
          }
          pagination={false}
          scroll={{y: 1000}}
        />
      </div>
    );
  }
}
