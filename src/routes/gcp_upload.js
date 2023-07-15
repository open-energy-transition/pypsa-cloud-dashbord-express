const express = require("express");
const router = express.Router();
const passport = require("passport");
const formData = require("express-form-data");
const multer = require("multer");
const gcp_storage = require("../config/index");
const error = require("mongoose/lib/error");
const bucket = gcp_storage.bucket("payment-dashboard");
const Jobs = require("../models/Jobs");
const gcpController = require("../controller/gcp");
var ObjectId = require("mongoose").Types.ObjectId;
const { submitWorkflow } = require("../controller/k8s");

router.post(
  "/name",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    const job_obj = await Jobs.create({
      name: req.body.jobName,
      user_id: req.user._id,
    });
    res.send(job_obj);
  }
);

router.post(
  "/version",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    try {
      const job = await gcpController.updateVersion(req.body.job_id, req.body.pypsa_ver);
      res.send(200, job);
    } catch {
      res.status(501).send(new error({ error: "Request falied", code: 501 }));
    }
  }
);

const multerMid = multer({
  storage: multer.memoryStorage({
    filename: (req, file, cb) => {
      //call the callback, passing it the original file name
      cb(null, req.query.file_name);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});


router.post(
  "/upload/config",
  passport.authenticate("jwt_strategy", { session: false }),
  multerMid.any(),
  async (req, res) => {
    try {
      const file = req.files[0];
      const { _, buffer } = file;
      const fileUrl = await gcpController.uploadFile(
        buffer,
        `${req.user}/${req.query/job_id}/configs/${req.query.file_name}.yaml`
      );
      const fname = req.query.file_name;
      await gcpController.updatefileUploadStatus(req.query.job_id, fname);
      res.status(200).json({
        message: "Upload was successful",
        data: fileUrl,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/upload/config/default",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    try {
      console.log("filename", req.query);
      const fname = req.query.file_name;
      const status = await gcpController.copyDefaultConfig(
        req.user.id,
        req.query.job_id,
        fname
      );
      await gcpController.updatefileUploadStatus(req.query.job_id, fname);
      res.status(200).json({
        message: "Upload was successful",
        data: { status },
      });
    } catch (err) {
      console.log(err);
      res.status(err.code).send(err.message);
    }
  }
);

router.get(
  "/name",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    const result = await Jobs.find({ name: req.query.jobName });
    res.send(result);
  }
);

router.get(
  "/userId",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    const result = await Jobs.find({ user_id: req.user._id });
    res.send(result);
  }
);

router.post(
  "/name/delete",
  passport.authenticate("jwt_strategy", { session: false }),
  async (req, res, next) => {
    const result = await Jobs.deleteMany({ name: { $in: req.body.job_names } });
    res.send(result);
  }
);

module.exports = router;
