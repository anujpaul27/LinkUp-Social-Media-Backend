const messageModel = require("../models/message.model");
const userModel = require('../models/users.models')
const {generateChatSuggestionsService} = require('../services/ai.services')

const getMessageSuggestions = async (req, res) => {
  try {
    const { targetUserId,currentUserId } = req.body;

    const userA = await userModel.findById(currentUserId);
    const userB = await userModel.findById(targetUserId);

    if (!userA || !userB) {
      return res.status(404).json({ message: 'User not found' });
    }

    // fetch to the last 10 message
    const chatHistory = await messageModel.find({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ]
    }).sort({ createdAt: -1 }).limit(4);

    const suggestions = await generateChatSuggestionsService(userA, userB, chatHistory.reverse());
    
    res.status(200).json({ success: true,suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const saveMessage = async (messageData) => {
  try {
    const { sender, receiver, text, messageType } = messageData;

    // create a new message
    const newMessage = new messageModel({
      sender,
      receiver,
      text,
      messageType,
    });
    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (error) {
    console.error("Error saving message to DB ❌:", error.message);
  }
};

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // find message link this A user send B and B user send A
    const messages = await messageModel
      .find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
      .sort({ createdAt: 1 }); // 1 means old message is up and new message show down on the message box  (Chrono order)

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages ❌:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @route   /api/messages/mark-as-seen
 * @dec     when user click to seen message hide unseen count from this box
 */
const hindUnseenMessageCount = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body; // Here senderId is friend and receiverId is you 

    // Update all messages from the sender to the receiver and mark them as seen
    await messageModel.updateMany(
      { sender: senderId, receiver: receiverId, isSeen: false },
      { $set: { isSeen: true } },
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  saveMessage,
  getMessages,
  hindUnseenMessageCount,
  getMessageSuggestions
};
