require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    //extract user information
    const { username, password } = req.body;

    //check is current user exists in the DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    //if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //create user token with jsonusertoken(jwt)
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({
      success: "true",
      message: "Logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
const registerUser = async (req, res) => {
  try {
    //extract user information from our body
    const { username, email, password, role } = req.body;

    //check if user already exists
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User with same username or email already exists! Please try again with different credentials",
      });
    }
    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user and save in DB
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    // const newlyCreatedUser = User.create({
    //     username,
    //     email,
    //     password : hashedPassword,
    //     role : role || "user"
    // })

    if (newlyCreatedUser) {
      res.status(200).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register a User",
    });
  }
};
//changePassword
const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password
    const { oldPassword, newPassword } = req.body;

    //get current Logged id user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    //check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is not correct! Please try again.",
      });
    }
    //hash new password here
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update password
    user.password = newHashedPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred!",
    });
  }
};

module.exports = { login, registerUser, changePassword };
