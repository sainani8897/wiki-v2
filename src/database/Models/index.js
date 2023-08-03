const User = require("./User");
const PersonalAccessTokens = require("./PersonalAccessToken");
const Sponsorship = require("./Sponsorship");
const MediaManager = require("./MediaManager");
const Document = require("./Document");
const Permission = require("./Permission");
const Role = require("./Role");
const Vendor = require("./Vendor");
const Organization = require("./Organization");

const models = {
  User,
  PersonalAccessTokens,
  Sponsorship,
  MediaManager,
  Document,
  Permission,
  Role,
  Vendor,
  Organization,
};

module.exports = models;
