"use strict";
//import dependency
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var CampaignSchema = new Schema({
  campaignName: String,
  campaignCustomization: [String],
  clients: {},
  startDate: String,
  endDate: String,
  officesIncludedinCampaign: [String]
});

//export our module to use in server.js

const Campaign = mongoose.model("Campaign", CampaignSchema);
module.exports = Campaign;
