import express from "express";
import mongoose from "mongoose";
import { Buch } from "../models/book.model.js";
import { body, param, query, validationResult } from "express-validator";

const router = express.Router();

// kleine Hilfsfunktion für Validierung
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
}

// Liste (mit optionalen Querys: status, q, page, limit)
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isIn(["ZU_LESEN", "LESE", "GELESEN", "ABGEBROCHEN"]),
  ],
  validate,
  async (req, res) => {
    try {
      const { status, q, page = 1, limit = 10 } = req.query;

      const filter = { besitzer: req.userId };
      if (status) filter.status = status;

      if (q) {
        const re = new RegExp(q, "i");
        filter.$or = [{ titel: re }, { autoren: re }, { notizen: re }];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [items, total] = await Promise.all([
        Buch.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        Buch.countDocuments(filter),
      ]);

      res.json({
        items,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Konnte Bücher nicht laden" });
    }
  }
);

// Detail
router.get(
  "/:id",
  [param("id").isMongoId()],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;

      const buch = await Buch.findOne({ _id: id, besitzer: req.userId });
      if (!buch) return res.status(404).json({ error: "Nicht gefunden" });

      res.json(buch);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Konnte Buch nicht laden" });
    }
  }
);

// Create
router.post(
  "/",
  [
    body("titel").isString().trim().notEmpty(),
    body("autoren").isArray(),
    body("status").optional().isIn(["ZU_LESEN", "LESE", "GELESEN", "ABGEBROCHEN"]),
    body("bewertung").optional({ nullable: true }).isInt({ min: 0, max: 5 }),
    body("notizen").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const { titel, autoren = [], status = "ZU_LESEN", bewertung = null, notizen = "" } = req.body;

      const buch = await Buch.create({
        titel,
        autoren,
        status,
        bewertung,
        notizen,
        besitzer: req.userId,
      });

      res.status(201).json(buch);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Konnte Buch nicht erstellen" });
    }
  }
);

// Update (vollständig/teilweise)
router.put(
  "/:id",
  [
    param("id").isMongoId(),
    body("titel").optional().isString().trim().notEmpty(),
    body("autoren").optional().isArray(),
    body("status").optional().isIn(["ZU_LESEN", "LESE", "GELESEN", "ABGEBROCHEN"]),
    body("bewertung").optional({ nullable: true }).isInt({ min: 0, max: 5 }),
    body("notizen").optional().isString(),
  ],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;

      const allowed = ["titel", "autoren", "status", "bewertung", "notizen"];
      const update = {};
      for (const key of allowed) {
        if (key in req.body) update[key] = req.body[key];
      }

      const buch = await Buch.findOneAndUpdate(
        { _id: id, besitzer: req.userId },
        update,
        { new: true }
      );

      if (!buch) return res.status(404).json({ error: "Nicht gefunden" });
      res.json(buch);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Konnte Buch nicht aktualisieren" });
    }
  }
);

// Delete
router.delete(
  "/:id",
  [param("id").isMongoId()],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Buch.deleteOne({ _id: id, besitzer: req.userId });
      if (result.deletedCount === 0)
        return res.status(404).json({ error: "Nicht gefunden" });

      res.json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Konnte Buch nicht löschen" });
    }
  }
);

export default router;