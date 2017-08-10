const express = require("express");
const router = express.Router();
const Client = require("../models/client.js");

const Agent = require("../models/agent.js");

const Campaign = require("../models/campaign.js");
const multer = require("multer");
var convertExcel = require("excel-as-json").processFile;

router.get("/clients", function(req, res, next) {
  Client.find({}).then(function(clients) {
    res.send(clients);
  });
});

router.get("/client/:id", function(req, res, next) {
  Client.findOne({ _id: req.params.id }).then(function(client) {
    res.json(client);
  });
});

router.get("/clients/:code", function(req, res, next) {
  Client.find({ agentCode: req.params.code }).then(function(clients) {
    res.send(clients);
  });
});

router.get("/agents", function(req, res, next) {
  Agent.find({}).then(function(agents) {
    res.send(agents);
  });
});

router.get("/campaigns", function(req, res, next) {
  Campaign.find({}, function(err, campaigns) {
    if (err) {
      throw err;
    }
    res.json(campaigns);
  });
});

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
        console.log(campaign);
        res.json(campaign);
      });
    });
});

router.delete("/clients/:id", function(req, res, next) {
  Client.findByIdAndRemove(req.params.id, function(err, client) {
    if (err) {
      throw err;
    }

    res.json(client);
  });
});

router.delete("/campaigns/:id", function(req, res, next) {
  Campaign.findByIdAndRemove(req.params.id, function(err, campaign) {
    if (err) {
      throw err;
    }

    res.json(campaign);
  });
});

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

router.get("/campaigns", function(req, res, next) {
  Campaign.find({}, function(err, campaigns) {
    if (err) {
      throw err;
    }
    res.json(campaigns);
  });
});

router.get("/campaigns/:id", function(req, res, next) {
  Campaign.findOne({ _id: req.params.id }, function(err, campaign) {
    if (err) {
      throw err;
    }
    res.json(campaign);
  });
});

router.put("/clients/:id", function(req, res, next) {
  var clientName = req.body.firstName + " " + req.body.lastName;
  console.log(clientName);
  console.log(req.body.firstName);
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
      console.log(response.clients[req.params.code]);
      res.json(response);
    });
  });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./data");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

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
