import { Router } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { asyncHandler, Errors } from "../utils/errors.js";
import { requireString } from "../utils/validate.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET || "splitsmart-secret-key-123";

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = requireString(req.body?.name, "name", { maxLength: 80 });
    const email = requireString(req.body?.email, "email", { maxLength: 100 }).trim().toLowerCase();
    const password = requireString(req.body?.password, "password", { minLength: 6 });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw Errors.badRequest("Invalid email format.");
    }

    // Check if user already exists
    const existing = await db.filter("users", (u) => u.email === email);
    if (existing.length > 0) {
      throw Errors.conflict("Email is already registered.");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = nanoid(10);
    const user = {
      id: userId,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    await db.put("users", userId, user);

    // Auto-link any existing group member entries that match this email
    const allMembers = await db.getAll("members");
    for (const member of allMembers) {
      if (member.email?.toLowerCase() === email) {
        member.userId = userId;
        await db.put("members", member.id, member);
      }
    }

    const token = generateToken(userId);
    res.status(201).json({
      token,
      user: { id: userId, name, email },
    });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = requireString(req.body?.email, "email").trim().toLowerCase();
    const password = requireString(req.body?.password, "password");

    const users = await db.filter("users", (u) => u.email === email);
    const user = users[0];
    if (!user) {
      throw Errors.unauthorized("Invalid email or password.");
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw Errors.unauthorized("Invalid email or password.");
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);
