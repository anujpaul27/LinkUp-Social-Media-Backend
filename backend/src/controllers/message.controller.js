const messageModel = require("../models/message.model");

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
  hindUnseenMessageCount
};
