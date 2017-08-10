import React from "react";
import "./App.css";
import axios from "axios";
import { Table, Input, Icon, Popconfirm } from "antd";
import { Button } from "semantic-ui-react";
import { Confirm } from "semantic-ui-react";
import moment from "moment";
import { Menu, Dropdown, message } from "antd";
import "antd/dist/antd.css";

export default class CampaignTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftData: [],
      rightData: [],
      campaigns: [],
      currentCampaign: "Not Included",
      columns: [],
      campaignId: "",
      clientsToSave: [],
      agentCode: this.props.agentCode,
      confirm: false,
      leftSearchText: "",
      leftSearchData: [],
      leftFiltered: false,

      rightSearchText: "",
      rightSearchData: [],
      rightFiltered: false,
      agentPastCampaigns: this.props.agent.pastCampaigns,
      pastCampaignObjects: [],
      masterListData: []
    };
  }

  componentWillMount() {
    //Cases:
    // 1) Agent already has clients in current Campaign
    // 2) Agent doesn't have clients in current campaign but had some in previous campaign
    // 3) Agent doesn't have clients in this campaign or previous campaign

    var self = this;
    axios.get("http://localhost:4000/api/campaigns").then(res => {
      var notIncluded = [];
      var included = [];
      var campaigns = [];
      var currentCampaign = "";
      var columns = [];
      var campaignId = "";
      var clientsToSave = [];
      var masterClients = this.props.dataSource;
      if (res.data.length > 1) {
        var lastIndex = res.data.length - 1;
        var currentCampaign = res.data[lastIndex];
        var currentClientIds = res.data[lastIndex].clients;
        var previousClientsIds = res.data[lastIndex - 1].clients;

        var agentClientsPrevious = [];
        masterClients.forEach(function(client) {
          if (previousClientsIds.includes(client._id)) {
            agentClientsPrevious.push(client);
          }
        });

        masterClients.forEach(function(client) {
          if (currentClientIds.includes(client._id)) {
            included.push(client);
          }
        });
        //no clients right now and no clients in the previous campaign

        if (included.length == 0 && agentClientsPrevious.length == 0) {
          console.log("no clients right now or before entered");
          var previousCampaign = res.data[lastIndex - 1];
          var previousCampaignTime = moment(previousCampaign.endDate)
            .toDate()
            .getTime();

          console.log(moment(previousCampaign.endDate).toDate());

          masterClients.forEach(function(client) {
            var editTime = moment(client.lastEdited).toDate().getTime();

            if (previousCampaignTime < editTime) {
              if (!included.includes(client)) {
                included.push(client);
              }
            }
          });

          masterClients.forEach(function(client) {
            if (!included.includes(client)) {
              notIncluded.push(client);
            }
          });
          self.setState({
            leftData: self.props.dataSource,
            rightData: [],
            campaigns: res.data,
            currentCampaign: currentCampaign.campaignName,
            columns: currentCampaign.campaignColumns,
            campaignId: currentCampaign._id,
            clientsToSave: currentClientIds,
            masterListData: self.props.dataSource
          });
          self.getCampaignObjects(res.data);
        }

        //Case 1
        if (included.length > 0) {
          masterClients.forEach(function(client) {
            if (!included.includes(client)) {
              notIncluded.push(client);
            }
          });

          self.setState({
            leftData: notIncluded,
            rightData: included,
            campaigns: res.data,
            currentCampaign: currentCampaign.campaignName,
            columns: currentCampaign.campaignColumns,
            campaignId: currentCampaign._id,
            clientsToSave: currentClientIds,
            masterListData: self.props.dataSource
          });

          self.getCampaignObjects(res.data);
        } else if (included.length == 0 && agentClientsPrevious.length > 0) {
          //Case 2
          console.log(
            "agent has clients from previous campaign but not current"
          );
          agentClientsPrevious.forEach(function(client) {
            included.push(client);
          });

          var previousCampaign = res.data[lastIndex - 1];
          var previousCampaignTime = moment(previousCampaign.endDate)
            .toDate()
            .getTime();

          masterClients.forEach(function(client) {
            var editTime = moment(client.lastEdited).toDate().getTime();

            if (previousCampaignTime < editTime) {
              if (!included.includes(client)) {
                included.push(client);
              }
            }
          });

          masterClients.forEach(function(client) {
            if (!included.includes(client)) {
              notIncluded.push(client);
            }
          });

          var includedIds = [];
          included.forEach(function(client) {
            includedIds.push(client._id);
          });

          self.setState({
            leftData: notIncluded,
            rightData: included,
            campaigns: res.data,
            currentCampaign: currentCampaign.campaignName,
            columns: currentCampaign.campaignColumns,
            campaignId: currentCampaign._id,
            clientsToSave: includedIds,
            masterListData: self.props.dataSource
          });
          self.getCampaignObjects(res.data);
        }
      } else {
        console.log("else entered");
        console.log("res.data:", res.data[0].clients);
        var included = [];
        this.props.dataSource.forEach(function(client) {
          if (res.data[0].clients.includes(client._id)) {
            included.push(client);
          }
        });
        self.setState({
          leftData: this.props.dataSource,
          rightData: included,
          campaign: res.data,
          currentCampaign: res.data[0].campaignName,
          columns: res.data[0].campaignColumns,
          campaignId: res.data[0]._id,
          clientsToSave: res.data[0].clients,
          masterListData: self.props.dataSource
        });
      }
    });
  }
  //end component will mount

  getCampaignObjects(campaigns) {
    for (var i = 0; i < campaigns.length; i++) {
      var campaignID = campaigns[i]._id;

      // console.log("campaign ID:", campaignID);
      // var campaign = this.state.agentPastCampaigns[i]
      if (this.state.agentPastCampaigns.includes(campaignID)) {
        var campaign = this.state.campaigns[i];
        // console.log("campaign before past:", campaign);
        var past = this.state.pastCampaignObjects;

        past.push(campaign);
        // console.log("past:", past);

        this.setState({
          pastCampaignObjects: past
        });
      }
    }
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

  moveOver(text) {
    var clients = this.state.clientsToSave;
    clients.push(text._id);

    var included = this.state.rightData;
    included.push(text);

    var notIncluded = this.state.leftData;
    var index = 0;
    for (var i = 0; i < notIncluded.length; i++) {
      var client = notIncluded[i];
      if (client._id == text._id) {
        index = i;
      }
    }

    notIncluded.splice(index, 1);

    if (this.state.leftFiltered) {
      var search = this.state.leftSearchData;
      var index = 0;
      for (var i = 0; i < search.length; i++) {
        var client = search[i];
        if (client._id == text._id) {
          index = i;
        }
      }
      search.splice(index, 1);
    }

    this.setState({
      rightData: included,
      leftData: notIncluded,
      clientsToSave: clients,
      leftSearchData: search
    });
    // console.log("left search data:", this.state.leftSearchData)
  }

  //add if left filtered true, also remove item from that list when included
  moveBack(text) {
    var client_ids = this.state.clientsToSave;
    var x = 0;
    for (var y = 0; y < client_ids.length; y++) {
      if (text._id == client_ids[y]) {
        x = y;
      }
    }
    client_ids.splice(x, 1);

    var self = this;
    var notIncluded = [];
    this.state.masterListData.forEach(function(client) {
      if (!self.state.rightData.includes(client)) {
        notIncluded.push(client);
      }
    });
    notIncluded.push(text);

    var included = this.state.rightData;
    var index = 0;
    for (var i = 0; i < included.length; i++) {
      var client = included[i];
      if (client._id == text._id) {
        index = i;
      }
    }
    included.splice(index, 1);

    if (this.state.rightFiltered) {
      var search = this.state.rightSearchData;
      var index = 0;
      for (var i = 0; i < search.length; i++) {
        var client = search[i];
        if (client._id == text._id) {
          index = i;
        }
      }
      search.splice(index, 1);
    }
    this.setState({
      rightData: included,
      leftData: notIncluded,
      clientsToSave: client_ids,
      rightSearchData: search
    });
    //   var key = "MasterList"
    //  this.onClick(key)
  }

  saveClients(clients) {
    var self = this;
    var data = {
      clients: clients
    };

    axios
      .put("http://localhost:4000/api/campaign/" + this.state.campaignId, data)
      .then(res => {
        self.setState({
          confirm: false
        });
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

  handleClearSearch() {
    this.setState({
      leftFiltered: false,
      leftSearchText: ""
    });
  }

  handleRightClearSearch() {
    this.setState({
      rightFiltered: false,
      rightSearchText: ""
    });
  }
  //search functions
  onInputChange(e) {
    this.setState({ leftSearchText: e.target.value });
  }
  onSearch() {
    const { leftSearchText } = this.state;
    const reg = new RegExp(leftSearchText, "gi");
    this.setState({
      filterLeftDropdownVisible: false,
      leftFiltered: !!leftSearchText,
      leftSearchData: this.state.leftData
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

  //right search functions
  onRightInputChange(e) {
    this.setState({ rightSearchText: e.target.value });
  }
  onRightSearch() {
    const { rightSearchText } = this.state;
    const reg = new RegExp(rightSearchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      rightFiltered: !!rightSearchText,
      rightSearchData: this.state.rightData
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
  //end right search functions

  onClick({ key }) {
    if (key == "MasterList") {
      var self = this;
      var notIncluded = [];
      this.state.masterListData.forEach(function(client) {
        if (!self.state.rightData.includes(client)) {
          notIncluded.push(client);
        }
      });
      this.setState({
        leftData: notIncluded
      });
    } else {
      var selectedCampaignClientIDs = [];
      {
        this.state.pastCampaignObjects.map(campaign => {
          if (campaign._id == key) {
            campaign.clients.map(clientID => {
              return selectedCampaignClientIDs.push(clientID);
            });
          }
        });
      }
      var oldCampaignDataObjects = [];
      var selectedClients = [];
      this.props.dataSource.map(client => {
        if (selectedCampaignClientIDs.includes(client._id)) {
          selectedClients.push(client);
        }
      });
      console.log(selectedClients);
      var filtered = [];
      var self = this;
      selectedClients.forEach(function(client) {
        if (!self.state.rightData.includes(client)) {
          filtered.push(client);
        }
      });
      console.log(filtered);
      this.setState({
        leftData: filtered
      });
    }

    console.log("old campaign data objects:", oldCampaignDataObjects);
    console.log("selected campaign client ids:", selectedCampaignClientIDs);
  }

  render() {
    console.log("right data:", this.state.rightData);
    // console.log("past campaign objects:", this.state.pastCampaignObjects);

    const menu = (
      <Menu onClick={key => this.onClick(key)}>
        {this.state.pastCampaignObjects.map(campaign => {
          if (campaign._id != this.state.campaignId) {
            return (
              <Menu.Item key={campaign._id}>
                {campaign.campaignName}
              </Menu.Item>
            );
          }
        })}
        <Menu.Item key="MasterList">Master List</Menu.Item>
      </Menu>
    );

    var leftColumns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        key: "clientName",
        width: "20%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientName, b.clientName);
        },
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={this.state.leftSearchText}
              onChange={e => this.onInputChange(e)}
              onPressEnter={() => this.onSearch()}
            />
            <Button type="primary" onClick={() => this.onSearch()}>
              Search
            </Button>
          </div>
        ),
        filterIcon: <Button>Search</Button>,
        filterLeftDropdownVisible: this.state.filterLeftDropdownVisible,
        onFilterLeftDropdownVisibleChange: visible => {
          this.setState(
            {
              filterLeftDropdownVisible: visible
            },
            () => this.searchInput.focus()
          );
        }
      },
      {
        title: "Client Address",
        dataIndex: "clientAddress",
        key: "clientAddress",
        width: "20%"
      },
      {
        title: "Client State",
        dataIndex: "clientState",
        key: "clientState",
        width: "12%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientState, b.clientState);
        }
      },
      {
        title: "Client City",
        dataIndex: "clientCity",
        key: "clientCity",
        width: "17%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientCity, b.clientCity);
        }
      },
      {
        title: "Move",
        dataIndex: "_id",
        key: "_id",
        width: "10%",
        render: (record, text, index) => {
          return (
            <a style={{ color: "#46797b" }} onClick={() => this.moveOver(text)}>
              Include
              <Icon
                type="right arrow"
                style={{ fontSize: 16 }}
                onClick={() => {
                  this.moveOver(text);
                }}
              />
            </a>
          );
        }
      }
    ];

    var rightColumns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        key: "clientName",
        width: "20%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientName, b.clientName);
        },
        filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
              ref={ele => (this.searchRightInput = ele)}
              placeholder="Search name"
              value={this.state.rightSearchText}
              onChange={e => this.onRightInputChange(e)}
              onPressEnter={() => this.onRightSearch()}
            />
            <Button type="primary" onClick={() => this.onRightSearch()}>
              Search
            </Button>
          </div>
        ),
        filterIcon: (
          <Icon
            type="search"
            style={{ color: this.state.rightFiltered ? "#108ee9" : "#aaa" }}
          />
        ),
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterDropdownVisible: visible
            },
            () => this.searchRightInput.focus()
          );
        }
      },
      {
        title: "Client Address",
        dataIndex: "clientAddress",
        key: "clientAddress",
        width: "20%"
      },
      {
        title: "Client State",
        dataIndex: "clientState",
        key: "clientState",
        width: "12%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientState, b.clientState);
        }
      },
      {
        title: "Client City",
        dataIndex: "clientCity",
        key: "clientCity",
        width: "17%",
        sorter: (a, b) => {
          return this.compareByAlph(a.clientCity, b.clientCity);
        }
      },
      {
        title: "Move Back",
        dataIndex: "_id",
        key: "_id",
        width: "13%",
        render: (record, text, index) => {
          return (
            <a style={{ color: "#46797b" }} onClick={() => this.moveBack(text)}>
              <Icon
                type="left arrow"
                style={{ fontSize: 16 }}
                onClick={() => {
                  this.moveBack(text);
                }}
              />
              Remove
            </a>
          );
        }
      }
    ];

    return (
      <div className="campaignPage">
        <h2 className="campaign-title">
          {" "}{this.state.currentCampaign}{" "}
        </h2>
        <div className="buildCampaign">
          <div className="leftTable">
            <br />
            <div className="left-table-title">
              <h3 className="left-title" style={{ "font-family": "Cantarell" }}>
                Not Included
              </h3>
            </div>
            <Dropdown overlay={menu} trigger={["click"]} default="MasterList">
              <a className="ant-dropdown-link" href="#">
                Select Campaign <Icon type="down" />
              </a>
            </Dropdown>
            <Button onClick={event => this.handleClearSearch(event)}>
              Clear Search
            </Button>
            <Table
              bordered
              dataSource={
                this.state.leftFiltered
                  ? this.state.leftSearchData
                  : this.state.leftData
              }
              columns={leftColumns}
              pagination={false}
              scroll={{ y: 350 }}
              rowKey="uid"
            />
          </div>
          <div className="middle" />
          <div className="rightTable">
            <br />
            <h3 style={{ "font-family": "Cantarell" }}> Included </h3>
            <Button onClick={event => this.handleRightClearSearch(event)}>
              Clear Search
            </Button>
            <Table
              bordered
              dataSource={
                this.state.rightFiltered
                  ? this.state.rightSearchData
                  : this.state.rightData
              }
              columns={rightColumns}
              pagination={false}
              scroll={{ y: 350 }}
              rowKey="uid"
            />
            <div className="save-button">
              <Button
                onClick={e => {
                  this.showConfirm();
                }}
                color="white"
              >
                <text className="save-text">Save</text>
              </Button>
            </div>
          </div>
        </div>
        <Confirm
          open={this.state.confirm}
          content="Are you sure you want to save your changes to this Campaign?"
          cancelButton="No"
          confirmButton="Yes"
          onCancel={() => this.handleCancelConfirm()}
          onConfirm={e => this.saveClients(this.state.clientsToSave)}
        />
      </div>
    );
  }
}
