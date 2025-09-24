import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Registrierung
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username und Passwort erforderlich" });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: "Benutzername existiert bereits" });

    const user = new User({ username });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({ message: "Benutzer registriert" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler bei der Registrierung" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Ungültige Anmeldedaten" });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: "Ungültige Anmeldedaten" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Login" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
    res.json({ userId: req.userId });
  });

export default router;