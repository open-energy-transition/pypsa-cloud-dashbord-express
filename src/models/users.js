const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");

const User = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: "Email already used!",
  },
  picture: {
    type: String,
  },
});

User.plugin(findOrCreate);
User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);
