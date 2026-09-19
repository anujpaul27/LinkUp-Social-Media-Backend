const express = require('express')
const { getMessages, hindUnseenMessageCount,getMessageSuggestions } = require('../controllers/message.controller')
const {aiSuggestionLimiter} = require('../middlewares/ai.suggestion.limit.middleware')
const messageRouter = express.Router()

messageRouter.get('/:senderId/:receiverId',getMessages)

/**
 * @route   /api/messages/mark-as-seen
 * @desc    when user click to seen message hide unseen count from this box
 * @access  Privet
 */
messageRouter.put('/mark-as-seen', hindUnseenMessageCount)

/**
 * @route   /api/messages/generate-message-suggetion
 * @desc    when user click to seen message hide unseen count from this box
 * @access  Privet
 */
messageRouter.post('/generate-message-suggestion',aiSuggestionLimiter, getMessageSuggestions)


module.exports = messageRouter