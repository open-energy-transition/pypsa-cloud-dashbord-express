require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const googleAuth = require("./routes/authentication");
const formData = require("express-form-data");
const uploadRouter = require("./routes/gcp_upload");
const downloadRouter = require("./routes/gcp_download");

require("./controller/controller.token_jwt");

const port = process.env.PORT;
const DB = require("./controller/database"); // INITILIZE DATABASE
const User = require("./models/users"); // USER MODEL
app.use(
  cors({
    origin: [process.env.BASE_FRONTEND_URL],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// app.use(formData.parse({ autoClean: true }));

app.use("/auth", googleAuth);

app.use("/fileDump", uploadRouter);

app.use(
  "/getDetails",
  passport.authenticate("jwt_strategy", { session: false }),
  (req, res) => {
    console.log(req.user);
    const body = {
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture,
    };
    res.json(body);
  }
);

app.use("/payment", require("./routes/payment"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/download", downloadRouter);

app.listen(port, () => console.log(`SERVER listening on port ${port}!`));
