const {dashboardProcess} = require("./dashboardProcess")

exports.main = async () => {
  try {
    await dashboardProcess();
  } catch (error) {
    console.log("**** Job Failed ****",error.message);
  }
};
