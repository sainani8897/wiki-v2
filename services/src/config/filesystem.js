const dotenv = require("dotenv");
const path = require('path')
dotenv.config();

module.exports = {
  disks: {
    local: {
      driver: "local",
      root: path.join(__dirname, '../storage'),
    },
    public: {
      driver: "local",
      root: path.join(__dirname, '../public'),
      url: process.env.APP_URL + "/public",
      visibility: "public",
    },
    s3: {
      driver: "s3",
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
      bucket: process.env.AWS_BUCKET,
      url: process.env.AWS_URL,
    },
  },
};
