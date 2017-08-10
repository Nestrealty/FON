import React, { Component } from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Card,
  Table,
  Popconfirm
} from "antd";
import "antd/dist/antd.css";
import "./CreateCampaignBuildTable.css";
// import TestTable from "./TestTable";
import CampaignTable from "./CampaignTable";
import MediaCenter from "./MediaCenter";
const FormItem = Form.Item;

export default class CreateCampaignUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploads: [],
      edit: false,
      // value: "",
      editedTitle: ""
      // done: false
    };
  }

  handleInput(event) {
    this.setState({
      ...this.state,
      uploadName: event.target.value
    });
  }

  handleNameNewUpload(event) {
    var upload = this.state.uploadName;
    this.state.uploadName = "";

    this.setState({
      ...this.state,
      uploads: this.state.uploads.concat(upload)
    });
    this.props.updateUploadState(this.state.uploads.concat(upload));
  }

  handleEditUpload(event, title) {
    // this.props.updateUploadState(this.state.uploads)
    this.setState({
      title: title,
      dataIndex: title,
      key: title,
      edit: true,
      value: title,
      editedTitle: title,
      uploadName: title
    });
  }

  handleResubmitUpload(event, value) {
    const uploadIndex = this.state.uploads.findIndex(upload => {
      return this.state.editedTitle === upload;
    });
    const updateUpload = this.state.uploadName;
    const updatedUploads = this.state.uploads.slice(0);
    updatedUploads[uploadIndex] = updateUpload;
    this.state.uploadName = "";

    this.props.updateUploadState(this.state.uploads);

    this.setState({
      edit: false,
      uploads: updatedUploads
    });
    this.props.updateUploadState(updatedUploads);
  }

  handleDeleteUpload(title) {
    var upload = this.state.uploads.filter(upload => {
      return upload != title;
    });

    this.setState({
      ...this.state,
      uploads: upload
    });

    this.props.updateUploadState(upload);
  }

  // handleAllUploadsComplete(event) {
  //   this.setState({
  //     ...this.state,
  //     done: true
  //   });
  // }

  // handleAllUploadsEdit(event) {
  //   this.setState({
  //     ...this.state,
  //     done: false
  //   });
  // }

  render() {
    return (
      <div>
        <Form>
          <h3>Uploads</h3>

          {!this.state.done &&
            <FormItem label="Create a new upload:" style={{ width: 150 }}>
              <Input
                placeholder="Upload Title"
                value={this.state.uploadName}
                onChange={event => this.handleInput(event)}
                onPressEnter={event =>
                  this.state.edit
                    ? this.handleResubmitUpload(event)
                    : this.handleNameNewUpload(event)}
              />
              <div>
                {!this.state.edit &&
                  <Button onClick={event => this.handleNameNewUpload(event)}>
                    Enter
                  </Button>}
                {this.state.edit &&
                  <Button
                    type="primary"
                    onClick={event => this.handleResubmitUpload(event)}
                  >
                    Resubmit
                  </Button>}
              </div>
            </FormItem>}
          {this.state.uploads.length == undefined && <div>No Uploads</div>}

          {this.state.uploads.map(upload => {
            return (
              <div>
                {" " + upload}
                <div className="columnName">
                  <Icon
                    type="close"
                    onClick={event => this.handleDeleteUpload(upload)}
                  />
                  <Icon
                    type={"edit"}
                    onClick={event => this.handleEditUpload(event, upload)}
                  />
                </div>
              </div>
            );
          })}
          <br />
        </Form>
      </div>
    );
  }
}
