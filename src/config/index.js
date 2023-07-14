const Cloud = require("@google-cloud/storage");
const path = require("path");
const serviceKey = path.join(__dirname, "./keys.json");

const { Storage } = Cloud;

const storage = new Storage({
  projectId: "crucial-oven-386720",
  credentials: JSON.parse(process.env.GCP_KEY),
});

module.exports = storage;
