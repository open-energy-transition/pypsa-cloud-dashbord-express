const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongodb = require("mongodb").MongoClient;
const cors = require("cors");

const dbUrl =
  "mongodb+srv://rohit267:good%40bye267@cluster0.u2mqy.mongodb.net/test?authSource=admin&replicaSet=atlas-hg9sk4-shard-0&readPreference=primary&appname=Glitch&ssl=true";

app.use(cors());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, // `email` must be unique
  },
  password: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((conn) => {
    console.log("DB Connection Success");
  });

app.get("/", (request, response) => {
  response.send({ server: "RINNING" });
});

app.post("/register", (req, res) => {
  console.log(req.body);
  var newUser = new User(req.body);
  newUser.save((err) => {
    if (err) {
      console.log(err);
      if (err.code === 11000) {
        if (err.keyPattern.email === 1) {
          res.send({
            status: "failed",
            message: "Dulicate email: " + err.keyValue.email,
          });
        }
      }
      // throw err;
    } else
      res.send({
        status: 204,
        message: "success",
      });
  });
});

app.post("/login", (req, res) => {
  console.log("Login:" + req.body.email + "," + req.body.password);

  User.findOne({ email: req.body.email }, function (err, login) {
    if(err){
      console.log(err);
      
      throw err;
    }
    else{
      if(login===null){
        res.send({status:'failed',message:'Usen not registered'})
        return
      }
      console.log(login)
      if (login.password === req.body.password) {
        res.send({
          status: "success",
          message: "Login Success",
        });
      } else {
        res.send({
          status: "failed",
          message: "Wrong password",
        });
      }
    } 
    
    
  });
});

// listen for requests :)
const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + 5000);
});
