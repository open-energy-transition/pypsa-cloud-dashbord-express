const express = require("express");
const router = express.Router();
const passport = require("passport");
const formData = require("express-form-data");
const multer = require("multer");
const gcp_storage = require("../config/index");
const error = require("mongoose/lib/error");
const bucket = gcp_storage.bucket("payment-dashboard");
const Jobs = require("../models/Jobs");
var ObjectId = require("mongoose").Types.ObjectId;
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
    const contents = await bucket.file(filepath).download();
    res.send(contents);
  }
);

router.get(
  "/getResults",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    console.log("getResults");
    const [contents] = await bucket.getFiles({
      prefix: `${req.user.id}/${req.query.job_id}/solved-networks/`,
    });
    const result_names = [];
    const promiseArr = contents.map((val) => {
      return new Promise((resolve, reject) => {
        let data = bucket.file(val.name).download();
        result_names.push(val.name.split("/").at(-1));
        resolve(data);
      });
    });
    Promise.all(promiseArr).then((val) => {
      const zip = new AdmZip();
      val.forEach((v, i) => {
        zip.addFile(result_names.at(i), v[0]);
      });
      const zip_buffer = zip.toBuffer();
      res.send({ val, result_names, zip_buffer });
    });
  }
);

module.exports = router;
