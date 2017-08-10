import React, { Component } from "react";
import axios from "axios";
import { Table, Icon, Popconfirm, Modal, LocaleProvider } from "antd";
import { Button, Dropdown, Input } from "semantic-ui-react";
import { Confirm } from "semantic-ui-react";
import moment from "moment";
import { Menu, message } from "antd";
import "antd/dist/antd.css";
import "./CampaignTable2.css";
import enUS from "antd/lib/locale-provider/en_US";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class CampaignTable2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterList: this.props.dataSource,
      agent: this.props.agent,
      agentCampaigns: [],
      included: [],
      includedSearchText: "",
      includedSearchData: [],

      notIncluded: this.props.dataSource,
      selectedCampaign: null,
      notIncludedSearchText: "",
      notIncludedSearchData: [],

      currentCampaign: null,
      allOtherClients: [],
      openModal: false,
      text: "",
      current: ""
    };
  }

  componentWillMount() {
    //Case 1 : clients saved in current campaign
    // Case 2 : No clients in past campaign or this one
    // Case 3 : clients in past campaign but not this one
    var self = this;
    axios.get("http://localhost:4000/api/campaigns").then(res => {
      var campaigns = res.data;

      var included = [];
      var notIncluded = [];
      var agentCampaigns = res.data.filter(campaign => {
        if (this.state.agent.pastCampaigns.includes(campaign._id)) {
          return campaign;
        }
      });

      if (agentCampaigns.length > 0) {
        var currentCampaign = agentCampaigns.filter(campaign => {
          var start = moment(campaign.startDate).toDate().getTime();
          var end = moment(campaign.endDate).toDate().getTime();
          var current = new Date().getTime();
          if (current >= start && current <= end) {
            return campaign;
          }
        });
        agentCampaigns.sort(function(a, b) {
          return (
            moment(a.endDate).toDate().getTime() -
            moment(b.endDate).toDate().getTime()
          );
        });

        var index = 0;
        for (var i = 0; i < agentCampaigns.length; i++) {
          if (agentCampaigns[i] == currentCampaign[0]) {
            index = i;
          }
        }

        var previousCampaign = agentCampaigns[index - 1];

        var code = this.state.agent.agentCode;
        var previousCampaignSavedClients = [];
        if (previousCampaign != null) {
          for (var agent in previousCampaign.clients) {
            if (agent == code && previousCampaign.clients[agent].length != 0) {
              previousCampaignSavedClients = previousCampaign.clients[agent];
            }
          }
        }

        var savedClients = [];

        for (var agent in currentCampaign[0].clients) {
          if (agent == code && currentCampaign[0].clients[agent].length != 0) {
            savedClients = currentCampaign[0].clients[agent];
          }
        }

        //Case 1
        if (savedClients.length > 0) {
          console.log("case one");
          included = savedClients;
          var includedIds = included.map(client => {
            return client._id;
          });
          notIncluded = this.state.masterList.filter(client => {
            if (!includedIds.includes(client._id)) {
              return client;
            }
          });
        } else if (previousCampaign !== null) {
          //Case 2
          if (
            savedClients.length == 0 &&
            previousCampaignSavedClients.length == 0
          ) {
            included = [];
            notIncluded = this.state.masterList;
            notIncluded.map(client => {
              var campaignEndTime = moment(currentCampaign[0].endDate)
                .toDate()
                .getTime();
              var lastEditedTime = moment(client.lastEdited).toDate().getTime();
              if (lastEditedTime > campaignEndTime) {
                included.push(client);
              }
            });
          }

          //Case 3
          if (
            savedClients.length == 0 &&
            previousCampaignSavedClients.length > 0
          ) {
            included = previousCampaignSavedClients;
            var includedIds = included.map(client => {
              return client._id;
            });
            notIncluded = this.state.masterList.filter(client => {
              if (!includedIds.includes(client._id)) {
                return client;
              }
            });
            notIncluded.map(client => {
              var campaignEndTime = moment(currentCampaign[0].endDate)
                .toDate()
                .getTime();
              var lastEditedTime = moment(client.lastEdited).toDate().getTime();
              if (lastEditedTime > campaignEndTime) {
                included.push(client);
              }
            });
          }
        } else {
          included = [];
          notIncluded = this.state.masterList;
        }

        self.setState({
          included: included,
          notIncluded: notIncluded,
          currentCampaign: currentCampaign[0],
          agentCampaigns: agentCampaigns
        });
      }
    });
  }

  include(client) {
    var new_included = this.state.included;
    new_included.push(client);
    var new_includedIds = new_included.map(client => {
      return client._id;
    });
    var newer_included = new_included.map(client => {
      if (new_includedIds.includes(client._id)) {
        return client;
      }
    });

    var newNotIncludedSearchData = this.state.notIncludedSearchData.filter(
      notClient => {
        return client != notClient;
      }
    );

    var new_notIncluded = this.state.notIncluded.filter(notClient => {
      return client._id != notClient._id;
    });

    this.setState({
      included: newer_included,
      notIncluded: new_notIncluded,
      notIncludedSearchData: newNotIncludedSearchData
    });
    this.saveClients(newer_included);
  }

  remove(client) {
    var new_notIncluded;
    if (this.state.selectedCampaign !== null) {
      var selectedCampaignIds = this.state.selectedCampaign.clients[
        this.state.agent.agentCode
      ].map(client => {
        return client._id;
      });
      new_notIncluded = this.state.notIncluded;
      if (selectedCampaignIds.includes(client._id)) {
        new_notIncluded.push(client);
      }
    } else {
      new_notIncluded = this.state.notIncluded;
      new_notIncluded.push(client);
    }

    var newIncludedSearchData = this.state.includedSearchData.filter(
      notClient => {
        return client != notClient;
      }
    );
    var new_included = this.state.included.filter(notClient => {
      return client._id != notClient._id;
    });

    this.setState({
      included: new_included,
      notIncluded: new_notIncluded,
      includedSearchData: newIncludedSearchData
    });

    this.saveClients(new_included);
  }

  saveClients(included) {
    var data = {
      clients: included
    };
    axios
      .put(
        "http://localhost:4000/api/campaign/" +
          this.state.currentCampaign._id +
          "/" +
          this.state.agent.agentCode,
        data
      )
      .then(res => {});
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

  //search functions Included
  onIncludedInputChange(e) {
    this.setState({ includedSearchText: e.target.value });
  }
  onIncludedSearch() {
    const { includedSearchText } = this.state;
    const reg = new RegExp(includedSearchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      includedFiltered: !!includedSearchText,
      includedSearchData: this.state.included
        .map(record => {
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
  //end search functions Included

  //search functions not included
  onNotIncludedInputChange(e) {
    this.setState({ notIncludedSearchText: e.target.value });
  }
  onNotIncludedSearch() {
    const { notIncludedSearchText } = this.state;
    const reg = new RegExp(notIncludedSearchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      notIncludedFiltered: !!notIncludedSearchText,
      notIncludedSearchData: this.state.notIncluded
        .map(record => {
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
  //end search functions not included
  handleIncludedClearSearch(event) {
    this.setState({
      includedFiltered: false,
      includedSearchText: ""
    });
  }

  handleNotIncludedClearSearch(event) {
    this.setState({
      notIncludedFiltered: false,
      notIncludedSearchText: ""
    });
  }

  showCampaign(e, data) {
    if (data.value !== "master") {
      var self = this;
      axios
        .get("http://localhost:4000/api/campaigns/" + data.value)
        .then(res => {
          var code = self.state.agent.agentCode;
          var includedIds = self.state.included.map(client => {
            return client._id;
          });
          var pastIncluded = res.data.clients[code];
          var selectedCampaign = res.data;
          var notIncluded = [];
          pastIncluded.map(client => {
            if (!includedIds.includes(client._id)) {
              notIncluded.push(client);
            }
          });
          self.setState({
            notIncluded: notIncluded,
            selectedCampaign: selectedCampaign
          });
        });
    } else {
      var includedIds = this.state.included.map(client => {
        return client._id;
      });
      var notIncluded = [];
      this.state.masterList.map(client => {
        if (!includedIds.includes(client._id)) {
          notIncluded.push(client);
        }
      });

      this.setState({
        notIncluded: notIncluded
      });
    }
  }

  //open customize campaign modal
  handleOpenModal() {
    this.setState({
      openModal: true
    });
  }

  handleCancel() {
    this.setState({
      openModal: false
    });
  }
  //end customize campaign modal

  handleTextChange(event, data, ID, field) {
    var included = this.state.included;
    var self = this;
    included.map(client => {
      if (client._id == ID) {
        client[field] = data.value;
        console.log(client[field]);
      }
    });
    this.saveClients(included);
  }

  handleClick(e) {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  }
  render() {
    console.log("included state:", this.state.included);
    var notIncludedColumns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        key: "clientName",
        width: "20%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientName, a.clientName);
        }
      },
      {
        title: "Client Address",
        dataIndex: "clientAddress",
        key: "clientAddress",
        width: "20%"
      },
      {
        title: "Client City",
        dataIndex: "clientCity",
        key: "clientCity",
        width: "17%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientCity, a.clientCity);
        }
      },
      {
        title: "Client State",
        dataIndex: "clientState",
        key: "clientState",
        width: "12%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientState, a.clientState);
        }
      },

      {
        title: "Move",
        dataIndex: "_id",
        key: "_id",
        width: "10%",
        render: (record, text, index) => {
          return (
            <a style={{ color: "#46797b" }} onClick={() => this.include(text)}>
              <Icon
                type="left arrow"
                style={{ fontSize: 16 }}
                onClick={() => {
                  this.include(text);
                }}
              />
              Include
            </a>
          );
        }
      }
    ];

    var IncludedColumns = [
      {
        title: "Client Name",
        dataIndex: "clientName",
        key: "clientName",
        width: "20%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientName, a.clientName);
        }
      },
      {
        title: "Client Address",
        dataIndex: "clientAddress",
        key: "clientAddress",
        width: "20%"
      },
      {
        title: "Client City",
        dataIndex: "clientCity",
        key: "clientCity",
        width: "17%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientCity, a.clientCity);
        }
      },
      {
        title: "Client State",
        dataIndex: "clientState",
        key: "clientState",
        width: "12%",
        sorter: (a, b) => {
          return this.compareByAlph(b.clientState, a.clientState);
        }
      },

      {
        title: "Move Back",
        dataIndex: "_id",
        key: "_id",
        width: "13%",
        render: (record, text, index) => {
          return (
            <a style={{ color: "#46797b" }} onClick={() => this.remove(text)}>
              Remove
              <Icon
                type="right arrow"
                style={{ fontSize: 16 }}
                onClick={() => {
                  this.remove(text);
                }}
              />
            </a>
          );
        }
      }
    ];

    var options = [];
    var self = this;
    this.state.agentCampaigns.map(campaign => {
      //the current campaign and future campaigns do not appear in the dropdown menu
      if (self.state.currentCampaign._id !== campaign._id) {
        var currentEnd = moment(self.state.currentCampaign.endDate)
          .toDate()
          .getTime();
        var campaignStart = moment(campaign.endDate).toDate().getTime();
        if (campaignStart < currentEnd) {
          options.push({
            text: campaign.campaignName,
            value: campaign._id
          });
        }
      }
    });
    options.push({
      text: "Master List",
      value: "master"
    });
    var modal;
    if (this.state.openModal) {
      modal = (
        <Modal
          visible={true}
          onCancel={event => this.handleCancel(event)}
          cancelText="Close"
          okText="Done"
          onOk={event => this.handleCancel(event)}
          width={1000}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {this.state.currentCampaign.campaignCustomization.map(field => {
              return (
                <div
                  style={{
                    marginLeft: "4%"
                  }}
                >
                  <h3>
                    {field}
                  </h3>
                  <div style={{ overflowY: "auto" }}>
                    {this.state.included.map(client => {
                      return (
                        <div>
                          <br />
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            {client.clientName} {"  "}
                            <Input
                              type="text"
                              defaultValue={client[field]}
                              style={{ margin: "auto" }}
                              onChange={(e, data) =>
                                this.handleTextChange(
                                  e,
                                  data,
                                  client._id,
                                  field
                                )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      );
    }

    if (this.state.currentCampaign !== null) {
      return (
        <div className="campaignPage">
          <br />

          <h2>
            {" Current Campaign: "}
            {this.state.currentCampaign.campaignName}{" "}
          </h2>
          <div className="dropdown">
            <h5>Past Campaigns Lists</h5>
            <Dropdown
              //the current campaign and future campaigns do not appear
              placeholder="Select Campaign"
              compact
              selection
              options={options}
              onChange={(e, data) => this.showCampaign(e, data)}
            />
          </div>
          <div className="custom-button">
            {this.state.currentCampaign.campaignCustomization != "" &&
              <div style={{ margin: "auto" }}>
                <Button
                  //Customize campaign button only appears if admin set custom fields for the agent to enter
                  onClick={event => this.handleOpenModal()}
                  color={"black"}
                >
                  Customize Campaign
                </Button>
              </div>}
          </div>
          <div className="tables">
            <div className="included-table">
              <h2 className="tableTitles">Included</h2>

              <div className="search-bar">
                <div style={{ width: "90%" }}>
                  <Input
                    //search for the included list
                    ref={ele => (this.includedSearchInput = ele)}
                    placeholder="Search included list by name, address, city, or state"
                    value={this.state.includedSearchText}
                    onChange={e => this.onIncludedInputChange(e)}
                    onPressEnter={() => this.onIncludedSearch()}
                    size="tiny"
                  />
                </div>
                <Button
                  type="primary"
                  size="tiny"
                  onClick={() => this.onIncludedSearch()}
                  style={{ marginLeft: "1%" }}
                >
                  Search
                </Button>
                <Button
                  type="primary"
                  size="tiny"
                  onClick={e => this.handleIncludedClearSearch(e)}
                >
                  Clear Search
                </Button>
              </div>
              <br />
              <LocaleProvider locale={enUS}>
                <Table
                  //included data
                  bordered
                  dataSource={
                    //if the state is filtered, show the data that matches the search, otherwise show all data
                    this.state.includedFiltered
                      ? this.state.includedSearchData
                      : this.state.included
                  }
                  columns={IncludedColumns}
                  pagination={false}
                  scroll={{ y: 350 }}
                  rowKey="uid"
                />
              </LocaleProvider>
            </div>
            <div style={{ width: "6%" }} />
            <div className="not-table">
              <h2 className="tableTitles">Not Included</h2>

              <div className="search-bar">
                <div style={{ width: "70%" }}>
                  <Input
                    //search for not included data
                    ref={ele => (this.notIncludedSearchInput = ele)}
                    placeholder="Search not included list by name, address, city, or state"
                    value={this.state.notIncludedSearchText}
                    onChange={e => this.onNotIncludedInputChange(e)}
                    onPressEnter={() => this.onNotIncludedSearch()}
                    size="tiny"
                  />
                </div>
                <Button
                  type="primary"
                  size="tiny"
                  onClick={() => this.onNotIncludedSearch()}
                  style={{ marginLeft: "1%" }}
                >
                  Search
                </Button>
                <Button
                  type="primary"
                  size="tiny"
                  onClick={e => this.handleNotIncludedClearSearch(e)}
                >
                  Clear Search
                </Button>
              </div>
              <br />
              <LocaleProvider locale={enUS}>
                <Table
                  //not included table
                  bordered
                  dataSource={
                    //if the state is filtered, show the data that matches the search , otherwise show all data
                    this.state.notIncludedFiltered
                      ? this.state.notIncludedSearchData
                      : this.state.notIncluded
                  }
                  columns={notIncludedColumns}
                  pagination={false}
                  scroll={{ y: 350 }}
                  rowKey="uid"
                />
              </LocaleProvider>
              {modal}
              {/* {this.state.openModal &&
                <LocaleProvider locale={enUS}>
                  <Modal
                    visible={true}
                    onCancel={event => this.handleCancel(event)}
                    okText="Done"
                    onOk={event => this.handleCancel(event)}
                  >
                    <Menu
                      onClick={e => this.handleClick(e)}
                      selectedKeys={this.state.current}
                      mode="horizontal"
                    >
                      {this.state.currentCampaign.campaignCustomization.map(
                        field => {
                          return (
                            <Menu.Item key={field}>
                              {field}
                            </Menu.Item>
                          );
                        }
                      )}
                    </Menu>
                    {this.state.included.map(client => {
                      var current = this.state.current;
                      return (
                        <div>
                          {client.clientName}
                          <input
                            type="text"
                            defaultValue={client[this.state.current]}
                            onChange={event =>
                              this.handleTextChange(
                                event,
                                client._id,
                                this.state.current
                              )}
                          />
                        </div>
                      );
                    })}
                  </Modal>
                </LocaleProvider>} */}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="campaignPage">
          <br />
          <h2>No Current Campaigns To Save </h2>
        </div>
      );
    }
  }
}

{
  /*{this.state.currentCampaign.campaignCustomization.map(

                      field => {
                        var customField = this.state.currentCampaign
                          .campaignCustomization[0];
                        return (
                          <div>
                            <h2>
                              <button>{field}</button>
                            </h2>
                            {this.state.included.map(client => {
                              return (
                                <div>
                                  {client.clientName}
                                  {"  "}

                                  <input
                                    type="text"
                                    defaultValue={client[field]}
                                    onChange={event =>
                                      this.handleTextChange(
                                        event,
                                        client._id,
                                        field
                                      )}
                                  />
                                  <br />
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    )}*/
}
