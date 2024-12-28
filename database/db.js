require("dotenv").config()
const mongoose = require("mongoose")

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is connected successfully");
        
    } catch (error) {
        console.log("MongoDB connection failed", error)
        process.exit(1)
    }
}

module.exports = connectToDb;