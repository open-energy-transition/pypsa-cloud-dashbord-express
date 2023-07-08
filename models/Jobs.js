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
  // incomplete: not all configs present
  // pending: all configs present, but not paid
  // solving: paid and solving
  // complete:veiw results
  status: {
    type: String,
    default: "incomplete",
  },
});

module.exports = mongoose.model("Jobs", Jobs);
