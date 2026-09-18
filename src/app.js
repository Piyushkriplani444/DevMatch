const express = require('express');
const connectDb = require("./config/database")
const app = express();
const UserModel = require("./model/user")


app.post("/signup", async (req,res)=>{
  const userObj = {
    firstName: "Rahul",
    lastName: "Kriplani",
    emailId: "rk123@gmail.com",
    password: "rahul@123",
    age: 29,
    gender: "M",
  }

  const user = new UserModel(userObj);
  const qq = await user.save();
  console.log("user", qq)
   res.send({ "user": qq});
})

connectDb().then(()=>{
    console.log("connect successfully ");
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
}).catch((err)=>{
    console.error("Connection Failed ");
})
