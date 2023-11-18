const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { join } = require("node:path");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://0.0.0.0:27017/chat_widget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userRoutes = require("./src/routes/userRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const Chat = require("./src/models/Chat");
const User = require("./src/models/User");

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});
app.use("/api", userRoutes);
app.use("/api", chatRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", async (data) => {
    try {
      let chat = await Chat.findOne({ userId: data.sender });

      let user = await User.findById(data.sender);

      if (!chat) {
        chat = new Chat({ userId: data.sender });
      }

      chat.messages.push(data);

      await chat.save();
      console.log("Message saved to the database");

      io.emit("chat message", { message: data.message, sender: user.name });
    } catch (error) {
      console.error("Error saving message to the database:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
