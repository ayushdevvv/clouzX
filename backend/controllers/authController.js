import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function formatUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    storageUsed: user.storageUsed,
    storageLimit: user.storageLimit,
  };
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      authProvider: "local",
      storageLimit: Number(process.env.STORAGE_LIMIT_BYTES) || 1073741824,
    });

    const token = generateToken(res, user._id);

    res.status(201).json({ user: formatUser(user), token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.authProvider !== "local") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(res, user._id);

    res.status(200).json({ user: formatUser(user), token: token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function googleAuth(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();

    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: email,
        authProvider: "google",
        avatar: payload.picture || "",
        storageLimit: Number(process.env.STORAGE_LIMIT_BYTES) || 1073741824,
      });
    }

    const token = generateToken(res, user._id);

    res.status(200).json({ user: formatUser(user), token: token });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed" });
  }
}

async function logoutUser(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
}

async function getMe(req, res) {
  res.status(200).json({ user: formatUser(req.user) });
}

export { registerUser, loginUser, googleAuth, logoutUser, getMe };
