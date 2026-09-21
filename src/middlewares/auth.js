const jwt = require("jsonwebtoken")
const UserModel = require("../model/user");
const userAuth  = async (req,res,next) =>{
    try{
        const { token } = req.cookies;
        const tokenData = await jwt.verify(token,"999@Piyush")
    
        if(!tokenData){
          throw new Error("invalid Token");
        }
        const { _id } = tokenData
        const user = await UserModel.findById(_id);
        if(!user){
          throw new Error("Invalid Token");
        }
        req.user= user
        next();
    } catch (err) {
        res.status(400).send("ERROR : " + err.message)
    }   
}

module.exports= {
    userAuth
}