const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  port:process.env.APP_PORT,
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  dbConnection:process.env.DB_CONNECTION,
  dbHost:process.env.DB_HOST,
  dbPort:process.env.DB_PORT,
  dbDatabase:process.env.DB_DATABASE,
  dbUsername:process.env.DB_USERNAME,
  dbPassword:process.env.DB_PASSWORD,
};