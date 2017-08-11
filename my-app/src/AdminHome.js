import React, { Component } from "react";
import "./AdminHome.css";
import Nest from "./Nest.png";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import axios from "axios";
import FileInput from "react-file-input";

export default class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      name: null
    };
  }
  handleChange(e) {
    // this.setState({
    //   selectedFiles: e.target.files
    // });
    let data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("name", e.target.files[0].name);
    //axios.post("/api/upload", data);
    console.log(data);
    this.setState({
      file: data,
      name: e.target.files[0].name
    });
  }

  handleSubmit() {
    console.log(this.state.file);
    axios.post("/api/upload", this.state.file);
    alert("Data Submitted from " + this.state.name);
  }
  render() {
    return (
      <Router>
        <div className="home-container">
          <div className="top">
            <div style={{ width: "33.33%" }} />
            <div className="logo">
              <img src={Nest} width={75} />
            </div>
            <div className="log-out">
              <div
                style={{ float: "right", paddingRight: "2%", paddingTop: "2%" }}
              >
                <Button color="black" onClick={() => this.props.logOut()}>
                  Log Out
                </Button>
              </div>
            </div>
          </div>
          <div className="middle">
            <div className="left">
              <Link to="/createcampaign">
                <button className="lft-btn">Create a Campaign</button>
              </Link>
              <br />
              <Link to="/managecampaigns">
                <button className="lft-btn">Manage Campaigns</button>
              </Link>
            </div>
            <div style={{ width: "10%" }} />
            <div className="right">
              <Link to="/clientdirectory">
                <button className="btn">Client Directory</button>
              </Link>
              <br />
              <Link to="/agentdirectory">
                <button className="btn">Agent Directory</button>
              </Link>
            </div>
          </div>
          <div className="bottom">
            <div>
              <h4>Add Agent's Clients</h4>
              <br />
              <input
                type="file"
                onChange={e => this.handleChange(e)}
                style={{ margin: "auto" }}
              />
              <br />
              <Button type="tiny" onClick={() => this.handleSubmit()}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
