const User = require('./User')
const PersonalAccessTokens = require('./PersonalAccessToken')
const Sponsorship = require('./Sponsorship')
const MediaManager = require('./MediaManager')
const Document = require('./Document')
const Permission = require('./Permission')
const Role = require('./Role')
const Vendor = require('./Vendor')
const Organization = require('./Organization')
const Course = require('./Course')
const Section = require('./Section')
const Lecture = require('./Lecture')

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
  Course,
  Section,
  Lecture
}

module.exports = models
