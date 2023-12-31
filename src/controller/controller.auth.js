const express = require("express");
const passport = require("passport");
const router = express.Router();
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv/config");
const User = require("../models/users");
require("./controller.token_jwt");
const DB = require("../controller/database");

const base_backend = process.env.BASE_BACKEND_URL;

const passportConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${base_backend}/auth/google/callback`,
  passReqToCallback: true,
};

passport.use(User.createStrategy());

passport.use(
  new GoogleStrategy(passportConfig, function (
    request,
    accessToken,
    refreshToken,
    profile,
    done
  ) {
    console.log("adding in db");
    console.log(profile);
    console.log(User.collection.dropIndexes());
    User.findOrCreate(
      { email: profile._json.email },
      {
        name: profile.displayName,
        email: profile._json.email,
        picture: profile._json.picture,
      },
      function (err, user) {
        return done(err, user);
      }
    );
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

module.exports = router;
