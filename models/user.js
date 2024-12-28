const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : [true, 'Book title is required'],
        unique : true,
        trim : true
    },
    email :{
        type: String,
        required : [true, 'Author name is required'],
        unique : true,
        trim : true,
        lowercase : true
    },
    password :{
        type : String,
        min : [8, "Password should be atleast 8 characters"]
    },
    role :{
        type : String ,
        enum : ["user", "admin"],
        default : "user"
    }
}, { timestamps : true})

module.exports = mongoose.model("User", UserSchema)
