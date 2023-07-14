const mongoose = require("mongoose");

const Jobs = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
  },
  pypsa_version: {
    type: String,
    trim: true,
    default: "main",
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
  // incomplete: not all configs present
  // pending: all configs present, but not paid
  // solving: paid and solving
  // complete:veiw results
  status: {
    type: String,
    default: "incomplete",
  },
  order_id: {
    type: String,
  },
  payment_id: {
    type: String,
  },
  payment_signature: {
    type: String,
  },
});

module.exports = mongoose.model("Jobs", Jobs);
