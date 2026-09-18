const mongoose = require("mongoose")
var validator = require('validator'); 

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
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password")
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    photoUrl:{
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL")
            }
        }
    },
    age: {
        type: Number,
        required: true,
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

module.exports = mongoose.model("User", userSchema)