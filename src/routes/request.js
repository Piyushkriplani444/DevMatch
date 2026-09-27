const express = require("express");
const UserModel = require("../model/user");
const requestRouter = express.Router();


requestRouter.get("/feed", async(req,res)=>{

  try {

    const users = await UserModel.find();
    res.send(users);
  }
  catch{
    res.statusCode(500).send("Something went wrong");
  }
})


module.exports = requestRouter;