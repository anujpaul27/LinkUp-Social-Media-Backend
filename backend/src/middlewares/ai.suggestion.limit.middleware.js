const rateLimit = require("express-rate-limit");

// Maximum two time call API in one minute 
const aiSuggestionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 2, 
  message: {
    success: false,
    message:
      "You can only request 2 AI suggestions per minute. Please wait a moment.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

module.exports = {
    aiSuggestionLimiter
}
