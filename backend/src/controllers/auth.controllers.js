const userModel = require("../models/auth.models");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or username already exists." });
    }

    // hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and return the created user in the response
    const newUser = await userModel.create({
      username,
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

module.exports = {
  register,
};
