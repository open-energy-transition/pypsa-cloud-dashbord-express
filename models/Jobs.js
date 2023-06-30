const mongoose = require("mongoose");

const Jobs = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
  },
  user_id: {
    type: String,
  },
  config: {
    type: Boolean,
    default: false,
  },
  bundle_config: {
    type: Boolean,
    default: false,
  },
  powerplantmatching_config: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Jobs", Jobs);
