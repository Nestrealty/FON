"use strict";
//import dependency
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var ClientSchema = new Schema({

  clientName: {type:String,default:"None"},
  firstName: {type:String,default:""},
  lastName: {type:String,default:""},
  clientAddress: {type:String,default:"None"},
  clientEmail: {type:String,default:"None"},
  clientCity: {type:String,default:"None"},
  clientState: {type:String,default:"None"},

  category: {
    type: String,
    default: "buyer"
  },
  clientBirthday: { type: String, default: "None" },
  homeAnniversary: { type: String, default: "None" },
  campaigns: { type: [String], default: ["None"] },
  childrenNames: { type: [String], default: ["None"] },
  lastEdited: {type:String,default:"None"},
  office: {type:String,default:"None"},
  agentCode: {type:String,default:"None"},
  agentName: {type:String,default:"None"},
  agentEmail: {type:String,default:"None"},
  agentTitle: {type:String,default:"None"},
  agentPhone: {type:String,default:"None"}
});

//export our module to use in server.js

const Client = mongoose.model("Client", ClientSchema);
module.exports = Client;
