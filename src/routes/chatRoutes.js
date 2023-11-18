const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/chats/:userId", chatController.createChat);
router.get("/chats/:userId", chatController.getAllChatsForUser);
router.post("/chats/:chatId/messages", chatController.addMessageToChat);

module.exports = router;
