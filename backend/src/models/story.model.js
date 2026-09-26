const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
    },
    userPhoto: {
      type: String,
    },
    mediaLink: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      default: "image",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 Hours lifetime
      },
      index: { expires: 0 }, // TTL Index: After 24 house delete automatically
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Story", storySchema);