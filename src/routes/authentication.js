const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
require("../controller/controller.auth");
require("dotenv/config");
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
const baseFrontendUrl = process.env.BASE_FRONTEND_URL;

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failedLogin",
    session: false,
  }),
  function (req, res) {
    const token = jwt.sign(
      { user: { email: req.user.email }, id: req.user._id },
      process.env.jwt_secret_key
    );
    console.log("Got token: ", Boolean(token))
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true
    }).redirect(`${baseFrontendUrl}/dashboard`);
  }
);

module.exports = router;
