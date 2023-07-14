const JwtStrategy = require("passport-jwt").Strategy;
const mongoose = require("mongoose");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv/config");
const User = require("../models/users");
const {
  fromExtractors,
  fromAuthHeaderAsBearerToken,
} = ExtractJwt;

function cookieExtractor(req) {
  var token = null;
  console.log("cookieextractor ran");
  console.log(req.cookies);
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
}

passport.use(
  "jwt_strategy",
  new JwtStrategy(
    {
      jwtFromRequest: fromExtractors([
        cookieExtractor,
        fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.jwt_secret_key,
      jwtCookieName: "jwt",
    },
    (payload, done) => {
      console.log("payload");
      console.log(payload);
      User.findById(String(payload.id), (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
