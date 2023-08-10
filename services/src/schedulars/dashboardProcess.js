const Queue = require("bull");
const dashboardController = require("../controllers/dashboard.controller");
const { Organization } = require("../database/Models");
const Dashbord = require("../database/Models/Dashboard");
const scheduledQueue = new Queue("scheduled jobs");

const dashboardProcess = async () => {
  return new Promise((resolve, reject) => {
    scheduledQueue.add(
      "dashboard_process",
      { your_data: "" },
      { repeat: { cron: "0 0 * * *" } }
    );
    scheduledQueue.process("dashboard_process", async (job) => {
      /** Logic Here */
      const organizations = await Organization.find({});
      let allProm = organizations.map((org) => {
        const value = Dashbord.saveOrgData(org._id);
      });
    });
    resolve("This went well");
  }).catch((error) => {
    reject(error.message);
  });
};

module.exports = {
  dashboardProcess,
};
