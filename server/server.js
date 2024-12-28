const express = require("express")
const app = express();
const connectToDb = require('./database/db')
const authRoutes = require("./routes/auth-routes")
const homeRoutes = require("./routes/home-routes")
const adminRoutes = require("./routes/admin-routes")
const uploadImageRoutes = require("./routes/image-routes")

const PORT = process.env.PORT || 5173;

connectToDb();
//middleware to parse json
 app.use(express.json())

 app.use("/api/auth", authRoutes )
 app.use("/api/home", homeRoutes)
 app.use("/api/welcome", adminRoutes)
 app.use("/api/image", uploadImageRoutes)


 app.listen(PORT, ()=>{
    console.log(`Server is now running on port ${PORT}`);
 })
