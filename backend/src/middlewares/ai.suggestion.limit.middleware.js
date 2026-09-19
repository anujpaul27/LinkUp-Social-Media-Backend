const rateLimit = require("express-rate-limit");

// ১ মিনিটে সর্বোচ্চ ২ বার AI এপিআই কল করা যাবে
const aiSuggestionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // ১ মিনিট
  max: 2, // প্রতি IP বা ইউজারের জন্য সর্বোচ্চ ২ টি রিকোয়েস্ট
  message: {
    success: false,
    message:
      "You can only request 2 AI suggestions per minute. Please wait a moment.",
  },
  standardHeaders: true, // `RateLimit-*` হেডার রিটার্ন করবে
  legacyHeaders: false,
});

module.exports = {
    aiSuggestionLimiter
}
