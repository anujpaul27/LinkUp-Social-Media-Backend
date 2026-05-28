const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true, // Still removes spaces from the beginning and end of the name, but allows spaces in between for full names
      minlength: [3, "Name must be at least 3 characters long."],
      maxlength: [50, "Name must be less than 50 characters long."], // Increased to 50 for longer full names
      match: [
        /^[a-zA-Z\s.]+$/,
        "Name can only contain letters, spaces, and dots.",
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
      select: false, // Password will not be returned by default in queries
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
