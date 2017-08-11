const express = require("express");
const router = express.Router();

// Mongoose Schemas
const Client = require("../models/client.js");
const Agent = require("../models/agent.js");
const Campaign = require("../models/campaign.js");

//Multer in order to process file submissions
const multer = require("multer");

//Module to convert Excel data of clients into JSON data which is then put into the database
var convertExcel = require("excel-as-json").processFile;

// Route to get all clients stored in the database
router.get("/clients", function(req, res, next) {
  Client.find({}).then(function(clients) {
    res.send(clients);
  });
});

// Route to get a specific client by mongo unique ID
router.get("/client/:id", function(req, res, next) {
  Client.findOne({ _id: req.params.id }).then(function(client) {
    res.json(client);
  });
});

// Route to get all clients whose agentCode is passed in through the request parameters
router.get("/clients/:code", function(req, res, next) {
  Client.find({ agentCode: req.params.code }).then(function(clients) {
    res.send(clients);
  });
});

// Route to get all agents in the database
router.get("/agents", function(req, res, next) {
  Agent.find({}).then(function(agents) {
    res.send(agents);
  });
});

//Route to get all campaigns in the database
router.get("/campaigns", function(req, res, next) {
  Campaign.find({}, function(err, campaigns) {
    if (err) {
      throw err;
    }
    res.json(campaigns);
  });
});

//Route to add a new client
router.post("/clients", function(req, res) {
  var clientName = req.body.firstName + " " + req.body.lastName;
  var client = new Client({
    clientName: clientName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    clientAddress: req.body.clientAddress,
    clientCity: req.body.clientCity,
    clientState: req.body.clientState,
    clientEmail: req.body.clientEmail,
    clientBirthday: req.body.clientBirthday,
    homeAnniversary: req.body.homeAnniversary,
    agentCode: req.body.agentCode,
    lastEdited: new Date().toISOString(),
    office: req.body.office,
    agentName: req.body.agentName,
    agentEmail: req.body.agentEmail,
    agentTitle: req.body.agentTitle,
    agentPhone: req.body.agentPhone
  });
  client.save(function(err) {
    if (err) {
      throw err;
    }
    res.json(client);
  });
});

// Route to add a new campaign which also adds an object of clients with each agent's code to keep track of clients
router.post("/campaign/", function(req, res, next) {
  var clients = {};
  Agent.find({})
    .then(function(agents) {
      for (var i = 0; i < agents.length; i++) {
        var code = agents[i].agentCode;
        clients[code] = [];
      }
    })
    .then(function() {
      var campaign = new Campaign({
        campaignName: req.body.campaignName,
        campaignCustomization: req.body.campaignCustomization,
        clients: clients,
        // campaignUploads: req.body.campaignUploads,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        officesIncludedinCampaign: req.body.officesIncludedinCampaign
      });

      campaign.save(function(err) {
        if (err) {
          throw err;
        }
        campaign;
        res.json(campaign);
      });
    });
});

// Remove a client by ID
router.delete("/clients/:id", function(req, res, next) {
  Client.findByIdAndRemove(req.params.id, function(err, client) {
    if (err) {
      throw err;
    }

    res.json(client);
  });
});

// Remove a campaign by ID
router.delete("/campaigns/:id", function(req, res, next) {
  Campaign.findByIdAndRemove(req.params.id, function(err, campaign) {
    if (err) {
      throw err;
    }

    res.json(campaign);
  });
});

// Edit an existing agent
router.put("/agent/:id", function(req, res, next) {
  Agent.findOne({ agentCode: req.params.id }, function(err, agent) {
    if (err) {
      throw err;
    }

    agent.agentName = req.body.agentName || agent.agentName;
    agent.agentEmail = req.body.agentEmail || agent.agentEmail;
    agent.agentEmail2 = req.body.agentEmail2 || agent.agentEmail2;
    agent.agentPhoneNumber =
      req.body.agentPhoneNumber || agent.agentPhoneNumber;
    agent.agentPhoneNumber2 =
      req.body.agentPhoneNumber2 || agent.agentPhoneNumber2;
    agent.agentTitle = req.body.agentTitle || agent.agentTitle;
    agent.agentOffice = req.body.agentOffice || agent.agentOffice;
    agent.pastCampaigns = req.body.pastCampaigns || agent.pastCampaigns;

    agent.save(function(err, agent) {
      if (err) {
        throw err;
      }
      res.json(agent);
    });
  });
});

// Route to change an Agent's password from the Admin
router.put("/agent/password/:id", function(req, res, next) {
  Agent.findOne({ agentCode: req.params.id }, function(err, agent) {
    if (err) {
      throw err;
    }

    agent.agentName = req.body.agentName || agent.agentName;
    agent.agentEmail = req.body.agentEmail || agent.agentEmail;
    agent.agentEmail2 = req.body.agentEmail2 || agent.agentEmail2;
    agent.agentPhoneNumber =
      req.body.agentPhoneNumber || agent.agentPhoneNumber;
    agent.agentPhoneNumber2 =
      req.body.agentPhoneNumber2 || agent.agentPhoneNumber2;
    agent.agentTitle = req.body.agentTitle || agent.agentTitle;
    agent.agentOffice = req.body.agentOffice || agent.agentOffice;
    if (req.body.password !== "") {
      agent.password = req.body.password;
    }

    agent.save(function(err, agent) {
      if (err) {
        throw err;
      }
      res.json(agent);
    });
  });
});

// Adding a new agent
router.post("/agent/new", function(req, res, next) {
  var agent = new Agent({
    agentCode: req.body.agentCode,
    agentName: req.body.agentName,
    agentTitle: req.body.agentTitle,
    agentEmail: req.body.agentEmail,
    agentEmail2: req.body.agentEmail2,
    agentPhoneNumber: req.body.agentPhoneNumber,
    agentPhoneNumber2: req.body.agentPhoneNumber2,
    agentOffice: req.body.agentOffice,
    pastCampaigns: [],
    password: req.body.password
  });

  agent.save(function(err, agent) {
    if (err) {
      throw err;
    }
    res.json(agent);
  });
});

// Retrieve all Campaigns
router.get("/campaigns", function(req, res, next) {
  Campaign.find({}, function(err, campaigns) {
    if (err) {
      throw err;
    }
    res.json(campaigns);
  });
});

// Retrieve a single campaign by ID
router.get("/campaigns/:id", function(req, res, next) {
  Campaign.findOne({ _id: req.params.id }, function(err, campaign) {
    if (err) {
      throw err;
    }
    res.json(campaign);
  });
});

// Edit an existing client
router.put("/clients/:id", function(req, res, next) {
  var clientName = req.body.firstName + " " + req.body.lastName;
  Client.findById(req.params.id, function(err, client) {
    if (err) {
      throw err;
    }
    client.clientName = clientName;
    client.firstName = req.body.firstName || client.firstName;
    client.lastName = req.body.lastName || client.lastName;
    client.clientAddress = req.body.clientAddress || client.clientAddress;
    client.clientCity = req.body.clientCity || client.clientCity;
    client.clientState = req.body.clientState || client.clientState;
    client.clientEmail = req.body.clientEmail || client.clientEmail;
    client.clientBirthday = req.body.clientBirthday || client.clientBirthday;
    client.homeAnniversary = req.body.homeAnniversary || client.homeAnniversary;
    client.lastEdited = new Date().toISOString();
    client.office = req.body.office || client.office;

    client.save(function(err, client) {
      if (err) {
        throw err;
      }
      res.json(client);
    });
  });
});

// Edit an existing campaign
router.put("/campaigns/:id/", function(req, res, next) {
  Campaign.findOne({ _id: req.params.id }, function(err, campaign) {
    if (err) {
      throw err;
    }
    campaign.campaignName = req.body.campaignName || campaign.campaignName;
    campaign.startDate = req.body.startDate || campaign.startDate;
    campaign.endDate = req.body.endDate || campaign.endDate;
    if (req.body.officesIncludedinCampaign.length > 0) {
      campaign.officesIncludedinCampaign = req.body.officesIncludedinCampaign;
    }

    if (req.body.campaignCustomization.length > 0) {
      campaign.campaignCustomization = req.body.campaignCustomization;
    }

    campaign.save(function(err, campaign) {
      if (err) {
        throw err;
      }
      res.json(campaign);
    });
  });
});

// When an agent adds a client to their list in a campaign, we edit the campaign's current clients
router.put("/campaign/:id/:code", function(req, res, next) {
  Campaign.findOne({ _id: req.params.id }, function(err, campaign) {
    if (err) {
      throw err;
    }
    campaign.clients[req.params.code] = req.body.clients;
    campaign.markModified("clients");
    campaign.save(function(err, response) {
      if (err) {
        throw err;
      }
      res.json(response);
    });
  });
});

// When Admin adds client data file, we store it in Data folder
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./data");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

// Then, we take the stored file and parse through it to add the converted JSON data into the Client collection
router.post("/upload", upload.single("file"), (req, res, next) => {
  convertExcel("./data/" + req.file.originalname, null, null, (err, data) => {
    var clients = [];
    if (err) {
      throw err;
    }
    data.forEach(function(client) {
      var new_client = new Client({
        clientName: "",
        clientAddress: "",
        clientEmail: "",
        clientCity: "",
        clientState: "",
        office: "",
        agentCode: "",
        agentName: "",
        agentEmail: "",
        agentTitle: "",
        agentPhone: "",
        lastEdited: new Date().toISOString()
      });

      new_client.clientName = client["DISPLAY NAME"];
      new_client.clientAddress = client["CLIENT ADDRESS"];
      new_client.clientCity = client["CLIENT CITY"];
      new_client.office = client["LOCATION"];
      new_client.clientEmail = client["CLIENT EMAIL"];
      new_client.clientState = client["CLIENT STATE"];
      new_client.agentCode = client["AGENT CODE"];
      new_client.agentName = client["AGENT FIRST AND LAST NAME"];
      new_client.agentEmail = client["AGENT NEST REALTY EMAIL"];
      new_client.agentTitle = client["REAL ESTATE TITLE"];
      new_client.agentPhone = client["AGENT PHONE NUMBER"];

      clients.push(new_client);
    });
    clients.map(client => {
      if (client.agentCode != "") {
        client.save(function(err, res) {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
  res.sendStatus(200);
});

module.exports = router;
