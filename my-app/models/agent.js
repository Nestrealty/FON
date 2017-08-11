"use strict";
//import dependency
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var SALT_WORK_FACTOR = 10;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var AgentSchema = new Schema({
  agentCode: String,
  agentName: String,
  agentTitle: String,
  agentEmail: String,
  agentEmail2: String,
  agentPhoneNumber: String,
  agentPhoneNumber2: String,
  agentOffice: String,
  pastCampaigns: [String],
  password: String
});

//Before saving an agent to the database, hash the entered password for safety

AgentSchema.pre("save", function(next) {
  var agent = this;

  // only hash the password if it has been modified (or is new)
  if (!agent.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(agent.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      agent.password = hash;
      next();
    });
  });
});

// Method that will be used when an agent logs in to check if the entered password is correct
AgentSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//export our module to use in server.js

const Agent = mongoose.model("Agent", AgentSchema);
module.exports = Agent;
