require("dotenv").config();
const express = require("express");
const app = express();

const port = process.env.PORT;
const DB = require("./controller/database"); // INITILIZE DATABASE
const User = require("./models/users"); // USER MODEL


//  MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));


//  CREEATE USER
app.post("/signup", (req, res) => {
  let newUSer = new User(req.body);
  
  newUSer.save((err,data) => {
    res.header({
      "Content-Type": "application/json",
    });
    
    if (err) {
      if(err.name==="MongoError" && err.code===11000){
        res.send(JSON.stringify({ status: "failed", error: "Email already used!" }));
        return;
      }
      else{
        res.statusCode(500);
        res.send(JSON.stringify({ status: "failed", error: "Something went worng." }));
        return;
      }
      
    }
    res.send(JSON.stringify({ status: "success", message:"Account created" }));
  });
});

//  LOGIN
app.post('/login',(req,res)=>{
  res.header({
    "Content-Type": "application/json",
  });
  User.findOne({email:req.body.email ,password:req.body.password},(err,data)=>{
    if(err){
      console.log(err);
      throw err;
    }
    else{
      if(data && data.password==req.body.password){
        res.send(JSON.stringify({ status: "success", message:"Login Success" }));
      }
      else{
        res.send(JSON.stringify({ status: "failed", message:"Wrong email or password" }));
      }
      
    }
  })
})

//  UPDATE NAME
app.post('/updateName',(req,res)=>{
  res.header({
    "Content-Type": "application/json",
  });
  User.findOne({email:req.body.email ,password:req.body.password},(err,data)=>{
    if(err){
      console.log(err);
      throw err;
    }
    else{
      if(data && data.password==req.body.password){
        User.update({_id: data._id},{name:req.body.name},(err)=>{
          if(err){
            console.log(err);
            throw err;
          }
          else{
            res.send(JSON.stringify({ status: "success", message:"Update Success" }));
          }
        })
        
      }
      else{
        res.send(JSON.stringify({ status: "failed", message:"Wrong email or password" }));
      }
      
    }
  })
})


// DELETE USER
app.post('/deleteUser',(req,res)=>{
  res.header({
    "Content-Type": "application/json",
  });
  User.findOne({email:req.body.email ,password:req.body.password},(err,data)=>{
    if(err){
      console.log(err);
      throw err;
    }
    else{
      if(data && data.password==req.body.password){
        User.deleteOne({_id: data._id},(err)=>{
          if(err){
            console.log(err);
            throw err;
          }
          else{
            res.send(JSON.stringify({ status: "success", message:"Delete Success" }));
          }
        })
        
      }
      else{
        res.send(JSON.stringify({ status: "failed", message:"Wrong email or password" }));
      }
      
    }
  })
})



app.listen(port, () => console.log(`SERVER listening on port ${port}!`));
