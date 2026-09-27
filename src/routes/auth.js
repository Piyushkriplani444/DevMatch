const express = require("express")
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation")
const bcryptjs  = require("bcryptjs")
const UserModel = require("../model/user");
const jwt = require('jsonwebtoken');


authRouter.post("/signup", async (req,res)=>{
  validateSignupData(req)

  const { firstName, lastName, emailId, password } = req.body;

  const passwordHash = await bcryptjs.hash(password,  10);
  try{
    const user = new UserModel({firstName, lastName, emailId, password: passwordHash});
    const qq = await user.save();
   res.send({ "user": qq});
  }catch(err){
    res.status(500).send(err);
  }
})



authRouter.post("/login", async(req, res)=>{
  try{
      const { emailId , password} = req.body;
      const user = await UserModel.findOne({ emailId : emailId});

      if(!user){
        throw new Error("Invalid Credential")
      }

      const isPasswordValid = await user.validatePassword(password);

      if(isPasswordValid){
        const token = await user.getJWT();
        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
        res.send("Login Successfully !!")
      }
      else{
        throw new Error("Invalid Credential")
      }
  }catch(err){
    res.status(400).send("Error"+ err)
  }
})

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("User Logged out successfully");
});


module.exports = authRouter;