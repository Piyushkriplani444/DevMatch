const express = require('express');
const connectDb = require("./config/database")
const app = express();
const UserModel = require("./model/user");
const { exceptions } = require('winston');


app.use(express.json())

app.post("/signup", async (req,res)=>{
  const userObj = req.body;

  try{
  const user = new UserModel(userObj);
  const qq = await user.save();
   res.send({ "user": qq});
  }catch(err){
    res.status(500).send(err);
  }
})


app.get("/user", async(req,res)=>{
  const userEmail = req.body.emailId

  try {

    const user = UserModel.findOne({ emailId : userEmail});
    res.send(user);

  }
  catch{
    res.status(500).send("Something went wrong");
  }
})




app.get("/feed", async(req,res)=>{

  try {

    const users = UserModel.find();
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




connectDb().then(()=>{
    console.log("connect successfully ");
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
}).catch((err)=>{
    console.error("Connection Failed ");
})
