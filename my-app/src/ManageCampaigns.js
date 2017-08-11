import React, { Component } from "react";
import {
  Form,
  Input,
  Icon,
  Row,
  Col,
  Checkbox,
  Button,
  Card,
  DatePicker,
  Popconfirm,
  Alert,
  message,
  Table,
  Modal
} from "antd";
import "antd/dist/antd.css";
import CampaignTable from "./CampaignTable";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import "./CreateCampaignParent.css";
import axios from "axios";
import { Grid } from "semantic-ui-react";
import moment from "moment";
import EditBuildTable from "./EditBuildTable";
import JSONtoExcel from "./JSONtoExcel";

const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const dateFormat = "MM/DD/YYYY";

const plainOptions = [
  "Asheville",
  "Charlottesville",
  "Fredericksburg",
  "New River Valley",
  "Richmond",
  "Shenandoah Valley",
  "Wilmington",
  "Northern Virginia",
  "Lake Norman",
  "The Triangle"
];

export default class ManageCampaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openModal: false,
      selectedCampaign: {},
      campaignName: "",
      checkedList: [],
      writeColumns: [],
      writeUploads: [],
      openExportDataModal: false,
      agentData: []
    };
  }

  componentWillMount() {
    var date = moment(this.state.selectedCampaign.startDate).format(
      "MM/DD/YYYY"
    );
    axios.get("/api/campaigns").then(res => {
      this.setState({
        data: res.data
      });
    });
    axios.get("/api/agents/").then(res => {
      this.setState({
        agentData: res.data
      });
    });
  }

  handleCampaignTitle(event) {
    this.setState({
      campaignName: event.target.value
    });
  }

  handleStartDate(date) {
    this.setState({
      ...this.state,
      startDate: date._d.toISOString()
    });
  }

  handleEndDate(date) {
    this.setState({
      ...this.state,
      endDate: date._d.toISOString()
    });
  }

  deleteCampaign(id) {
    axios.delete("/api/campaigns/" + id);
  }

  handleOpenModal(text) {
    this.setState({
      openModal: true,
      selectedCampaign: text
    });
  }

  handleOpenExportDataModal(text) {
    this.setState({
      openExportDataModal: true,
      selectedCampaign: text
    });
  }

  handleCancel(event) {
    this.setState({
      openModal: false,
      openExportDataModal: false
    });
  }

  handleDone(event) {
    this.setState({
      openExportDataModal: false
    });
  }

  updateColumnState(columns) {
    this.setState({
      ...this.state,
      writeColumns: columns
    });
  }

  updateUploadState(uploads) {
    this.setState({
      ...this.state,
      writeUploads: uploads
    });
  }

  onChange(checkedList) {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length
    });
  }

  WritetoDatabase() {
    axios
      .put("/api/campaigns/" + this.state.selectedCampaign._id, {
        campaignName: this.state.campaignName,
        campaignCustomization: this.state.writeColumns,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        officesIncludedinCampaign: this.state.checkedList
      })
      .then(res => {
        var id = res.data._id;
        for (var i = 0; i < this.state.agentData.length; i++) {
          if (
            res.data.officesIncludedinCampaign.includes(
              this.state.agentData[i].agentOffice
            )
          ) {
            var agentCode = this.state.agentData[i].agentCode;
            var agent = this.state.agentData[i];
            if (!agent.pastCampaigns.includes(id)) {
              agent.pastCampaigns.push(id);
            }
            axios.put("/api/agent/" + agentCode, agent);
          } else {
            var agentCode = this.state.agentData[i].agentCode;
            var agent = this.state.agentData[i];
            if (agent.pastCampaigns.includes(id)) {
              var index = agent.pastCampaigns.indexOf(id);
              agent.pastCampaigns.splice(index, 1);
            }
            axios.put("/api/agent/" + agentCode, agent);
          }
        }
        var data = this.state.data;
        var newData = [];
        data.map(campaign => {
          if (res.data._id !== campaign._id) {
            newData.push(campaign);
          }
        });
        newData.push(res.data);
        this.setState({
          data: newData
        });
      });
    this.setState({
      openModal: false
    });
  }

  render() {
    const columns = [
      {
        title: "Campaign Title",
        dataIndex: "campaignName",
        key: "campaignName"
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) =>
          <span>
            <a onClick={() => this.handleOpenModal(text)}>Edit</a>
            <span className="ant-divider" />
            <Popconfirm
              title="Are you sure you want to delete this entire campaign?"
              okText="Yes"
              cancelText="Do not delete"
              onConfirm={() => this.deleteCampaign(text._id)}
            >
              <a>Delete Campaign</a>
            </Popconfirm>
            <span className="ant-divider" />
            <a onClick={() => this.handleOpenExportDataModal(text)}>
              Export Data
            </a>
          </span>
      }
    ];
    return (
      <div>
        <div className="header">
          <Link to="/">
            <Icon type="arrow-left" style={{ fontSize: 30, color: "white" }} />
          </Link>
          <h1 className="agentDirectory">Manage Campaigns</h1>
          <br />
        </div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
        />

        {this.state.openModal &&
          //modal for editing the campaign details
          <div>
            <Modal
              visible={true}
              onCancel={event => this.handleCancel(event)}
              onOk={() => this.WritetoDatabase()}
            >
              <div className="campaignform">
                <Grid divided="vertically">
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <h3>Campaign</h3>
                      <br />
                      <FormItem style={{ width: 150 }}>
                        <Input
                          placeholder="Title"
                          onChange={event => this.handleCampaignTitle(event)}
                          defaultValue={
                            this.state.selectedCampaign.campaignName
                          }
                        />
                      </FormItem>
                    </Grid.Column>
                    <Grid.Column>
                      <h3>Campaign Timeline</h3>
                      <br />
                      <FormItem>
                        <DatePicker
                          placeholder="Start date"
                          format={dateFormat}
                          onChange={event => this.handleStartDate(event)}
                          defaultValue={moment(
                            this.state.selectedCampaign.startDate
                          )}
                        />
                        <DatePicker
                          placeholder="End date"
                          format="MM/DD/YYYY"
                          onChange={event => this.handleEndDate(event)}
                          defaultValue={moment(
                            this.state.selectedCampaign.endDate
                          )}
                        />
                      </FormItem>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <div>
                  <h3>Select Offices to Include</h3>
                  <br />
                  <div style={{ borderBottom: "1px solid #E9E9E9" }} />
                  <br />
                  <CheckboxGroup
                    options={plainOptions}
                    defaultValue={
                      this.state.selectedCampaign.officesIncludedinCampaign
                    }
                    onChange={checkedList => this.onChange(checkedList)}
                  />
                </div>
                <br />
                <br />
                <Form className="createcampaigntables">
                  <EditBuildTable
                    //editing custom campaign fields component
                    updateColumnState={columns =>
                      this.updateColumnState(columns)}
                    selectedCampaign={this.state.selectedCampaign}
                  />

                  {/*
                  was originally intended to allow admin to create upload fields that would go into a media center, however, that functionality is not complete
                  <EditUploadTable
                    updateUploadState={uploads =>
                      this.updateUploadState(uploads)}
                    selectedCampaign={this.state.selectedCampaign}
                  />*/}
                </Form>
              </div>
            </Modal>
          </div>}

        {this.state.openExportDataModal &&
          <Modal
            //modal for exporting data
            visible={true}
            onCancel={event => this.handleCancel(event)}
            okText="Done"
            onOk={event => this.handleDone(event)}
          >
            <div>
              {this.state.selectedCampaign.officesIncludedinCampaign.map(
                office => {
                  return (
                    <div>
                      {office}
                      <JSONtoExcel
                        office={office}
                        campaignName={this.state.selectedCampaign.campaignName}
                        selectedCampaignObject={this.state.selectedCampaign}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </Modal>}
      </div>
    );
  }
}
