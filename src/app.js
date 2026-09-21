const express = require('express');
const connectDb = require("./config/database")
const UserModel = require("./model/user");
const { validateSignupData } = require("./utils/validation")
const bcryptjs  = require("bcryptjs")
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth")

const app = express();
app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req,res)=>{
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


app.get("/user", async(req,res)=>{
  const userEmail = req.body.emailId

  try {

    const user = await UserModel.findOne({ emailId : userEmail});
    res.send(user);

  }
  catch{
    res.status(500).send("Something went wrong");
  }
})

app.get("/profile", userAuth, async ( req, res) =>{
   try{
    
    const user = req.user;
    if(!user){
      throw new Error("Invalid Token");
    }
    res.send(user)
   }catch(err){
    res.status(400).send("Error"+ err)
  }

})




app.get("/feed", async(req,res)=>{

  try {

    const users = await UserModel.find();
    res.send(users);
  }
  catch{
    res.statusCode(500).send("Something went wrong");
  }
})


app.patch("/user/:userId", async( req,res)=>{
    const userId = req.params?.userId;
    const updateBody = req.body;

    try{

      const allowedFields = ["photoUrl","about","gender", "age", "skills"]
      const validateBody = Object.keys(updateBody).every((k)=> allowedFields.includes(k))

      if(!validateBody){
        throw new Error("Validation Failed")
      }

      const user = await UserModel.findByIdAndUpdate(userId, updateBody, {
        runValidators: true,
      })
      res.send("updated Succesfully")

    }catch(err){
      res.status(400).send("Error"+ err)
    }

})


app.post("/login", async(req, res)=>{

  const { emailId , password} = req.body;
  try{
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

connectDb().then(()=>{
    console.log("connect successfully ");
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
}).catch((err)=>{
    console.error("Connection Failed ");
})
