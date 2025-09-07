import { verify } from "../lib/jwt.js";

export default function requireAuth(req, res, next) {
  const token = req.cookies?.access;
  if (!token) return res.status(401).json({ message: "Unauthenticated" });
  try {
    const payload = verify(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}