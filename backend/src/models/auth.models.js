const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      lowercase: true, // Convert username to lowercase before saving to ensure case-insensitive uniqueness
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long."],
      maxlength: [30, "Username must be less than 30 characters long."],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      trim: true, // trim can remove spaces from the beginning and end of the email
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [6, "Password must be at least 6 characters long."],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        "Password must contain at least one letter and one number.",
      ],
      select: false, // Password will not be returned by default in queries
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
