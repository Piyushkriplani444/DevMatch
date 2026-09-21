const mongoose = require("mongoose");
var validator = require('validator'); 
const jwt = require('jsonwebtoken');
const bcryptjs  = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstName : {
        type:  String,
        required: true,
        min: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a Strong Password")
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://img.magnific.com/free-vector/user-blue-gradient_78370-4692.jpg?t=st=1740779693~exp=1740783293~hmac=3ffc11733917c931bddeec957e8fa649e6a1590282b3210d816ccbf54dab2e94&w=900",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Genfer is not valid ")
            }
        }
    },
    about: {
        type: String,
        default: "",
    },
    skills: {
        type: [String]
    }
    },
    {
        timestamps: true,
    }
)


userSchema.method.getJWT = async function() {
    const token =  await jwt.sign({ _id: this._id }, "999@Piyush", { expiresIn: "1d" });
    return token;
}

userSchema.method.validatePassword = async function(passwordInput) {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcryptjs.compare(passwordInput, passwordHash);
    return isValidPassword;
}

module.exports = mongoose.model("User", userSchema)