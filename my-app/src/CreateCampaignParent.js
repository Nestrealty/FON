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
  message
} from "antd";
import "antd/dist/antd.css";
import CampaignTable from "./CampaignTable";
import CreateCampaignUpload from "./CreateCampaignUpload";
import CreateCampaignBuildTable from "./CreateCampaignBuildTable";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import "./CreateCampaignParent.css";
import axios from "axios";
import { Grid } from "semantic-ui-react";

const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const plainOptions = [
  "Asheville",
  "Charlottesville",
  "Fredericksburg",
  "Lake Norman",
  "New River Valley",
  "Richmond",
  "Shenandoah Valley",
  "The Triangle",
  "Wilmington"
];
const defaultCheckedList = [];

export default class CreateCampaignParent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      writeColumns: [],
      writeUploads: [],
      campaignTitle: "",
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      done: false,
      agentData: [],
      campaignID: ""
    };
  }

  componentWillMount() {
    axios.get("/api/agents/").then(res => {
      this.setState({
        agentData: res.data
      });
    });
  }

  handleCampaignTitle(event) {
    this.setState({
      campaignTitle: event.target.value
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

  WritetoDatabase() {
    var id = "";
    this.setState({
      done: true
    });
    axios({
      method: "post",
      url: "/api/campaign/",
      data: {
        campaignName: this.state.campaignTitle,
        campaignCustomization: this.state.writeColumns,
        // campaignUploads: this.state.writeUploads,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
        officesIncludedinCampaign: this.state.checkedList
      }
    }).then(res => {
      id = res.data._id;
      for (var i = 0; i < this.state.agentData.length; i++) {
        if (
          this.state.checkedList.includes(this.state.agentData[i].agentOffice)
        ) {
          var agentCode = this.state.agentData[i].agentCode;
          var agent = this.state.agentData[i];
          agent.pastCampaigns.push(id);
          axios.put("/api/agent/" + agentCode, agent);
        }
      }
    });
  }

  //start functions for check list
  onChange(checkedList) {
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length
    });
  }

  onCheckAllChange(e) {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  }
  //end functions for check list

  render() {
    return (
      <div>
        <div>
          <div className="header">
            <Link to="/">
              <Icon
                type="arrow-left"
                style={{ fontSize: 30, color: "white" }}
                onClick={message.destroy()}
              />
            </Link>
            <h1 className="agentDirectory">Create a Campaign</h1>

            <br />
          </div>

          {!this.state.done &&
            //the person is not allowed to create a campaign if they haven't entered a start and end date
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
                      />
                    </FormItem>
                  </Grid.Column>
                  <Grid.Column>
                    <h3>Campaign Timeline</h3>
                    <br />
                    <FormItem>
                      <DatePicker
                        placeholder="Start date"
                        format="MM/DD/YYYY"
                        onChange={event => this.handleStartDate(event)}
                      />
                      <DatePicker
                        placeholder="End date"
                        format="MM/DD/YYYY"
                        onChange={event => this.handleEndDate(event)}
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
                  value={this.state.checkedList}
                  onChange={e => this.onChange(e)}
                />
              </div>
              <br />
              <br />
              <Form className="createcampaigntables">
                <CreateCampaignBuildTable
                  //component that manages campaign customization functionality
                  updateColumnState={columns => this.updateColumnState(columns)}
                />

                {/*
                //didn't finish with uploading 
                <CreateCampaignUpload
                  updateUploadState={uploads => this.updateUploadState(uploads)}
                />*/}
              </Form>
              <br />
              <br />
              <div>
                {(this.state.endDate || this.state.startDate) == "" &&
                  <Popconfirm
                    title="Please check that you have entered a start and end date for your campaign."
                    okText="Ok"
                  >
                    <Button type="danger">Finish Creating Campaign</Button>
                  </Popconfirm>}
              </div>
              <div>
                {this.state.startDate &&
                  this.state.endDate != "" &&
                  <Popconfirm
                    title="Are you sure you're finished creating the campaign？"
                    okText="Yes"
                    cancelText="Keep Editing"
                    onConfirm={event => this.WritetoDatabase()}
                  >
                    <Button type="danger">Finish Creating Campaign</Button>
                  </Popconfirm>}
              </div>
            </div>}
          {this.state.done &&
            <div className="successText">
              Campaign successfully created. See Manage Campaigns to edit or
              delete your campaign.
            </div>}
        </div>
      </div>
    );
  }
}
