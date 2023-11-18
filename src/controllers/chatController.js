const Chat = require('../models/Chat');
const User = require('../models/User');

const createChat = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chat = new Chat({ userId: user._id, messages: [] });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllChatsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const chats = await Chat.find({ userId: user._id });
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addMessageToChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const { sender, message } = req.body;
    chat.messages.push({ sender, message });
    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createChat,
  getAllChatsForUser,
  addMessageToChat,
};
