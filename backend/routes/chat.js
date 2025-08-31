import express from "express";
import { protect } from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = express.Router();

// Get io instance (we'll pass this from server.js)
let io;
export const setIO = (ioInstance) => {
  io = ioInstance;
};

// Get all conversations for the logged-in user
router.get("/conversations", protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name email picture")
      .populate({
        path: "lastMessage",
        select: "content createdAt sender",
        populate: { path: "sender", select: "name picture" },
      })
      .sort({ updatedAt: -1 });
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
});

// Get all messages for a conversation
router.get("/messages/:conversationId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("sender", "name picture")
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// Send a message
router.post("/messages", protect, async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    if (!conversationId || !content) {
      return res.status(400).json({
        success: false,
        message: "conversationId and content are required",
      });
    }

    const message = new Message({
      conversationId,
      sender: req.user._id,
      content,
    });
    await message.save();

    // Populate sender info for the response
    await message.populate("sender", "name picture");

    // Update last message in conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    // Emit Socket.IO event for real-time updates
    if (io) {
      const messageData = {
        _id: message._id,
        conversationId: message.conversationId,
        content: message.content,
        sender: message.sender,
        createdAt: message.createdAt,
      };
      console.log(
        "📡 Broadcasting message to room:",
        conversationId,
        messageData
      );
      io.to(conversationId).emit("receive_message", messageData);
    } else {
      console.log("❌ io instance not available");
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// Create a new conversation (if not exists)
router.post("/conversations", protect, async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!participantId) {
      return res
        .status(400)
        .json({ success: false, message: "participantId is required" });
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, participantId],
      });
      await conversation.save();
    }

    // Populate participants for the response
    await conversation.populate("participants", "name email picture");

    res.status(201).json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
      error: error.message,
    });
  }
});

router.post("/groups", protect, async (req, res) => {
  try {
    const { name, participants } = req.body;

    // Ensure the requesting user is always included
    let allParticipants = [req.user._id];
    if (participants && Array.isArray(participants)) {
      participants.forEach((pId) => {
        if (!allParticipants.includes(pId.toString())) {
          // Convert to string for comparison
          allParticipants.push(pId);
        }
      });
    }

    // Basic validation for participants (e.g., ensure valid ObjectIds if needed)
    // For now, we'll trust the provided userIds or assume Mongoose will handle casting errors.

    if (allParticipants.length < 2) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "A group chat requires at least two participants including yourself.",
        });
    }

    const newGroupConversation = new Conversation({
      name: name || null, // Allow name to be optional
      isGroup: true,
      participants: allParticipants,
    });

    await newGroupConversation.save();

    // Populate participants for the response
    await newGroupConversation.populate("participants", "name email picture");

    res.status(201).json({ success: true, conversation: newGroupConversation });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create group conversation",
      error: error.message,
    });
  }
});

export default router;
