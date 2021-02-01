require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const port = process.env.PORT;
const DB = require("./controller/database");
const User = require("./models/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/signup", (req, res) => {
  let newUSer = new User(req.body);
  
  console.log("USER CREATED", newUSer);
  console.log(mongoose.connection.readyState);
  newUSer.save((err,data) => {
    
    if (err) {
      res.header({
        "Content-Type": "application/json",
      });
      res.send(JSON.stringify({ status: "failed", error: err }));
      return;
    }
    res.header({
      "Content-Type": "application/json",
    });
    res.send(JSON.stringify({ status: "success",data: data }));
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
