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

router.get(
  "/getResults",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    console.log("getResults");
    const contents = await bucket.file("results/results.zip").download();
    res.send(contents);
  }
);

module.exports = router;
