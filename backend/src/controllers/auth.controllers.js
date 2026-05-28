const userModel = require("../models/auth.models");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { name }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or name already exists." });
    }

    // hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and return the created user in the response
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "user created successfully",
      user: newUser,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if do not exist user with the provided email
        const user = await userModel.findOne ({email}).select('+password')
        if (!user) {
            return res.status(400).json({message: "Invalid email."})
        }
        console.log(user);

        // Check password
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid password."})
        }

        res.status(200).json({
            message: "Login successful.",
            user: user,
        })
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        })
    }
}

module.exports = {
  register,
    login,
};
