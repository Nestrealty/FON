import React, { Component } from "react";
import "./JSONtoExcel.css";
import axios from "axios";

//***Note: to make sure that data is in the right column, if a field is empty, make sure it is set to an empty string instead of not being there at all

const officeAddresses = [
  {
    office: "Asheville",
    returnLine1: "394 Merrimon Ave Suite A",
    returnLine2: "Asheville, NC 28801"
  },
  {
    office: "Charlottesville",
    returnLine1: "126 Garrett St Suite D",
    returnLine2: "Charlottesville, VA 22902"
  },
  {
    office: "Fredericksburg",
    returnLine1: "510 Princess Anne St, Suite 201",
    returnLine2: "Fredericksburg, VA 22401"
  },
  {
    office: "New River Valley",
    returnLine1: "400 N Main St",
    returnLine2: "Blacksburg VA 24060"
  },
  {
    office: "Richmond",
    returnLine1: "1657 West Broad Street Suite 3A",
    returnLine2: "Richmond, VA 23220"
  },
  {
    office: "Shenandoah Valley",
    returnLine1: "307 N. Augusta Street",
    returnLine2: "Staunton, VA 24401"
  },
  {
    office: "Wilmington",
    returnLine1: "1508 Military Cutoff Rd Suite 203",
    returnLine2: "Wilmington NC 28403"
  },
  {
    office: "Lake Norman",
    returnLine1: "",
    returnLine2: ""
  },
  {
    office: "The Triangle",
    returnLine1: "",
    returnLine2: ""
  },
  {
    office: "Northern Virginia",
    returnLine1: "",
    returnLine2: ""
  }
];

export default class JSONtoExcel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignName: this.props.campaignName,
      office: this.props.office,
      selectedCampaignClients: this.props.selectedCampaignObject.clients
    };
  }

  handleClick(event) {
    var data = [];
    var selectiveData = Object.keys(
      this.state.selectedCampaignClients
    ).filter(key => {
      if (this.state.selectedCampaignClients[key].length > 0) {
        this.state.selectedCampaignClients[key].filter(client => {
          console.log(client.office, this.state.office);
          if (client.office.toLowerCase() === this.state.office.toLowerCase()) {
            {
              officeAddresses.map(office => {
                if (office.office == this.state.office) {
                  var new_client = {
                    "Client Name": client.clientName,
                    "First Name": client.firstName,
                    "Last Name": client.lastName,
                    "Client Email": client.clientEmail,
                    "Client Address": client.clientAddress,
                    "Client City": client.clientCity,
                    "Client State": client.clientState,
                    "Client Birthday": client.clientBirthday,
                    "Home Anniversary": client.homeAnniversary,
                    "Agent Office": client.office,
                    "Agent Name": client.agentName,
                    "Agent Code": client.agentCode,
                    "Agent Email": client.agentEmail,
                    "Agent Title": client.agentTitle,
                    "Agent Phone": client.agentPhone,
                    "Return Address Line 1": office.returnLine1,
                    "Return Address Line 2": office.returnLine2
                  };

                  var campaign = this.props.selectedCampaignObject;
                  var customFields = campaign.campaignCustomization;

                  customFields.map(field => {
                    if (client[field] != undefined) {
                      new_client[field] = client[field];
                    } else {
                      new_client[field] = "None";
                    }
                  });

                  return data.push(new_client);
                }
              });
            }
          }
        });
      }
    });

    if (data == "") return;

    this.JSONToCSVConvertor(
      data,
      this.state.campaignName + this.state.office,
      true
    );
  }

  JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

    var CSV = "";
    //Set Report title in first row or line

    CSV += ReportTitle + "\r\n\n";

    //This condition will generate the Label/Header
    if (ShowLabel) {
      var row = "";

      //This loop will extract the label from 1st index of on array
      for (var index in arrData[0]) {
        //Now convert each value to string and comma-seprated
        row += index + ",";
      }

      row = row.slice(0, -1);

      //append Label row with line break
      CSV += row + "\r\n";
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
      var row = "";

      //2nd loop will extract each column and convert it in string comma-seprated
      for (var index in arrData[i]) {
        row += '"' + arrData[i][index] + '",';
      }

      row.slice(0, row.length - 1);

      //add a line break after each row
      CSV += row + "\r\n";
    }

    if (CSV == "") {
      alert("Invalid data");
      return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = "data:text/csv;charset=utf-8," + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  render() {
    return (
      <div className="mydiv">
        <button className="gen_btn" onClick={event => this.handleClick(event)}>
          Generate File
        </button>
      </div>
    );
  }
}
