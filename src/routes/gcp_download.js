const express = require("express");
const router = express.Router();
const passport = require("passport");
const gcpHelpers = require("../helpers/gcp");
const AdmZip = require("adm-zip");
const gcp_storage = require("../config/index");
const bucket = gcp_storage.bucket(
  process.env.STORAGE_BUCKET || "payment-dashboard"
);

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
  "/getPypsaData",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    console.log("get pypsa data");
    const user_id = req.user.id;
    const order_id = req.query.job_id;
    const filepath = `${user_id}/${order_id}/pypsa-data/pypsa-data.zip`;
    res.setHeader("Content-disposition", "attachment; filename=pypsa-data.zip");
    bucket
      .file(filepath)
      .createReadStream() //stream is created
      .pipe(res);
  }
);

router.get(
  "/getResults",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res) => {
    console.log("getResults");
    const prefix = `${req.user.id}/${req.query.job_id}/solved-networks/`;
    const [blobDetails] = await gcpHelpers.getFiles(prefix);
    const blobNames = blobDetails.map((val) => val.name);
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
