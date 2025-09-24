import "dotenv/config.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.use("/auth", authRoutes);
app.use("/books", authMiddleware, bookRoutes); // geschützt

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}).catch((e) => {
  console.error("DB connection error:", e);
  process.exit(1);
});