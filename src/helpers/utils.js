const { downloadFile } = require("./gcp");
const yaml = require("yaml");

async function calculateCost(userId, jobId) {
  const configPath = `${userId}/${jobId}/configs/config.yaml`;
  const file = await downloadFile(configPath);
  console.log(file);
  const config = yaml.parse(file.toString());
  console.log(config)
  // add some cost function here
  const scenario = config.scenario;
  const numberOfNetworks = Object.values(scenario).reduce((acc, val) => acc + val.length, 0);
  console.log(numberOfNetworks, "needed networks");
  return numberOfNetworks * 100;
}

module.exports = {
    calculateCost
}
