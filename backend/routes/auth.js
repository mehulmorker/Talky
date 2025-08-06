import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth endpoint
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    // Check if user already exists
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with same email but different auth method
      user = await User.findOne({ email });

      if (user) {
        // Update existing user with Google ID
        user.googleId = googleId;
        user.picture = picture;
        user.isEmailVerified = email_verified;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Create new user
        user = new User({
          googleId,
          email,
          name,
          picture,
          isEmailVerified: email_verified,
          lastLogin: new Date(),
        });
        await user.save();
      }
    } else {
      // Update last login for existing user
      user.lastLogin = new Date();
      user.picture = picture; // Update profile picture
      user.isEmailVerified = email_verified;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);

    if (error.message.includes("Token used too late")) {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please try logging in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Verify token endpoint
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("Token verification failed: No token provided");
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.log(
        "Token verification failed: Invalid JWT token",
        jwtError.message
      );
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        error: jwtError.message,
      });
    }

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-__v");

    if (!user) {
      console.log("Token verification failed: User not found", decoded.userId);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Token verification successful for user:", user.email);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during token verification",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
