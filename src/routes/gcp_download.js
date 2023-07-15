const express = require("express");
const router = express.Router();
const passport = require("passport");
const gcpHelpers = require("../helpers/gcp");
const AdmZip = require("adm-zip");

router.get(
  "/getConfig",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    console.log("getConfig");
    const user_id = req.user.id;
    const order_id = req.query.job_id;
    const file_name = req.query.file_name;
    const filepath = `${user_id}/${order_id}/configs/${file_name}.yaml`;
    const contents = await gcpHelpers.downloadFile(filepath);
    res.send(contents);
  }
);

router.get(
  "/getResults",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res) => {
    console.log("getResults");
    const prefix = `${req.user.id}/${req.query.job_id}/solved-networks/`
    const [blobDetails] = await gcpHelpers.getFiles(prefix);
    const blobNames = blobDetails.map(val => val.name);
    const results = await gcpHelpers.downloadFiles(blobNames);
    const zip = new AdmZip();
    for (const result of results) {
      console.log(result.name, "zipped");
      zip.addFile(result.name, result.file);
    }
    const zip_buffer = zip.toBuffer();
    res.send({ zip_buffer });
  }
);

module.exports = router;
