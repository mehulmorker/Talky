import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Search users by name or email (excluding current user)
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, users: [] });
    }
    const regex = new RegExp(q, "i");
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        { $or: [{ name: regex }, { email: regex }] },
      ],
    }).select("name email picture");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search users",
      error: error.message,
    });
  }
});

export default router;
