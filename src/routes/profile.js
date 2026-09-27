const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const { validateEditFields } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async ( req, res) =>{
   try{
    
    const user = req.user;
    if(!user){
      throw new Error("Invalid Token");
    }
    res.send(user)
   }catch(err){
    res.status(400).send("Error"+ err)
  }

});

profileRouter.patch("/profile/edit", userAuth, async( req,res)=>{
    try{

      if (!validateEditFields(req)) {
        throw new Error("Invalid Edit request");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
      await loggedInUser.save();
      res.json({
        message: ` ${loggedInUser.firstName}, your profile updated successfully`,
        data: loggedInUser,
      });
    }catch(err){
      res.status(400).send("Error"+ err)
    }

});

module.exports = profileRouter;