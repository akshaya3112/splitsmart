import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { Errors } from "../utils/errors.js";

const JWT_SECRET = process.env.JWT_SECRET || "splitsmart-secret-key-123";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(Errors.unauthorized("Authentication required. Please log in."));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(Errors.unauthorized("Authentication required. Please log in."));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return next(Errors.unauthorized("Invalid or expired session. Please log in again."));
    }

    const user = await db.get("users", decoded.userId);
    if (!user) {
      return next(Errors.unauthorized("User account not found. Please log in again."));
    }

    // Exclude password hash from the user object for security
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    next(err);
  }
}
