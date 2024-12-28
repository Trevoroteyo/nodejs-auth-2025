const express = require("express")
const {login, registerUser, changePassword} = require("../controllers/auth-controllers");
const authMiddleware = require("../middleware/auth-middleware");

//create express router
const router = express.Router()

//routes
router.get("/login", login);
router.post('/signup', registerUser)
router.post("/change-password",authMiddleware, changePassword)

module.exports = router; 