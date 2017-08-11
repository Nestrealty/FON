//server.js
"use strict";

//first we import our dependencies...
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var path = require("path");
var convertExcel = require("excel-as-json").processFile;

// routes that will be used when api is called
const routes = require("./routes/api");

const config = require("./public/config.json");

//Mongoose Schemas
const Client = require("./models/client.js");
const Agent = require("./models/agent.js");
const Campaign = require("./models/campaign.js");

//Initiating the App with express
var app = express();
var router = express.Router();

var port = process.env.API_PORT || 4000;

//Your MongoDB URI from the cluster
const MONGODB_URI = config.uri;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./public")));
// // Serve static assets
// app.use(express.static(path.resolve(__dirname, "..", "build")));

// // Always return the main index.html, so react-router render the route in the client
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
// });

// app.get("*", function(req, res) {
//   res.sendFile(path.resolve(__dirname, "./build/index.html"));
// });

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  //and remove cacheing so we get the most recent comments
  res.setHeader("Cache-Control", "no-cache");
  next();
});

//Connecting to Mongo using the URI
mongoose.connect(
  "mongodb://fonlist:OVZH4WxCo1HnhrkD@cluster0-shard-00-00-khyxs.mongodb.net:27017,cluster0-shard-00-01-khyxs.mongodb.net:27017,cluster0-shard-00-02-khyxs.mongodb.net:27017/Nest?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  {
    useMongoClient: true
  },
  function(err) {
    if (err) {
      throw err;
    }
  }
);
mongoose.Promise = global.Promise;

//Route for when an agent/admin tries to login
app.post("/:id", function(req, res) {
  Agent.findOne({ agentCode: req.params.id }, function(err, agent) {
    if (err) {
      throw err;
    }
    if (agent.agentCode == "ADMIN") {
      //Case that the ADMIN logged in
      res.send(agent);
    } else if (agent.agentCode !== "ADMIN") {
      // Case that an agent logged in
      agent.comparePassword(req.body.password, function(err, isMatch) {
        if (err) {
          throw err;
        }
        if (isMatch) {
          res.send(agent);
        } else {
          res.send(false);
        }
      });
    } else {
      res.send(false);
    }
  });
});

//Retrieving an agent from a given id as a parameter
app.get("/:id", function(req, res) {
  Agent.findOne({ agentCode: req.params.id }, function(err, agent) {
    if (err) {
      throw err;
    }
    res.send(agent);
  });
});

// Express middleware
app.use("/api", routes);
app.use(bodyParser.json());

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});

/**The following commented code is used to add all agents provided in an excel sheet. In the the initial setup, 
 * if the agents are not already in the database, put an excel file of all agents in the project directory 
 * and use the below code
 */
// convertExcel("./agents.xlsx", null, null, function(err, data) {
//   var agentsWithCodes = [];
//   var agentWithoutCodes = [];
//   data.forEach(function(agent) {
//     var new_agent = Agent({
//       agentCode: "",
//       agentName: "",
//       agentTitle: "",
//       agentEmail: "",
//       agentPhoneNumber: "",
//       agentOffice: "",
//       pastCampaigns: [],
//       password: ""
//     });
//     var password;
//     var email1 = "";
//     var email2 = "none";
//     var phone1 = "";
//     var phone2 = "none";

//     var emailIndex = agent["AGENT EMAIL"].indexOf(".com");
//     var lastEmailIndex = agent["AGENT EMAIL"].lastIndexOf(".com");
//     if (emailIndex == lastEmailIndex) {
//       email1 = agent["AGENT EMAIL"];
//     } else {
//       email1 = agent["AGENT EMAIL"].slice(0, emailIndex + 4);
//       email2 = agent["AGENT EMAIL"].slice(
//         emailIndex + 5,
//         agent["AGENT EMAIL"].length
//       );
//     }

//     var phoneIndex = agent["AGENT PHONE NUMBER"].indexOf("/");
//     if (phoneIndex !== -1) {
//       phone1 = agent["AGENT PHONE NUMBER"].slice(0, phoneIndex);
//       phone2 = agent["AGENT PHONE NUMBER"].slice(
//         phoneIndex + 1,
//         agent["AGENT PHONE NUMBER"].length
//       );
//     } else {
//       phone1 = agent["AGENT PHONE NUMBER"];
//     }

//     if (agent["AGENT CODE"] !== "") {
//       new_agent.agentCode = agent["AGENT CODE"];
//       new_agent.agentName = agent["AGENT NAME"];
//       new_agent.agentTitle = agent["AGENT TITLE"];
//       new_agent.agentEmail = email1;
//       new_agent.agentEmail2 = email2;
//       new_agent.agentPhoneNumber = phone1;
//       new_agent.agentPhoneNumber2 = phone2;
//       new_agent.agentOffice = agent["AGENT OFFICE"];
//       new_agent.password = agent["AGENT CODE"].toLowerCase();
//       agentsWithCodes.push(new_agent);
//     } else {
//       new_agent.agentCode = agent["AGENT NAME"];
//       new_agent.agentName = agent["AGENT NAME"];
//       new_agent.agentTitle = agent["AGENT TITLE"];
//       new_agent.agentEmail = email1;
//       new_agent.agentEmail2 = email2;
//       new_agent.password = agent["AGENT CODE"].toLowerCase();
//       new_agent.agentPhoneNumber = agent["AGENT PHONE NUMBER"];
//       new_agent.agentPhoneNumber2 = phone2;
//       new_agent.agentOffice = agent["AGENT OFFICE"];
//       agentWithoutCodes.push(new_agent);
//     }
//   });

//   agentsWithCodes.forEach(function(agent) {
//     agent.save(function(err) {
//       if (err) {
//         throw err;
//       }
//     });
//   });
//   agentWithoutCodes.forEach(function(agent) {
//     agent.save(function(err) {
//       if (err) {
//         throw err;
//       }
//     });
//   });
// });
