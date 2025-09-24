import "dotenv/config.js";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/user.model.js";
import { Buch } from "../src/models/book.model.js";

async function run() {
  try {
    await connectDB();

    // Vorher alles löschen (nur für Entwicklung!)
    await User.deleteMany({});
    await Buch.deleteMany({});

    // User anlegen
    const eylem = new User({ username: "eylem" });
    await eylem.setPassword("passwort123");
    await eylem.save();

    const alice = new User({ username: "alice" });
    await alice.setPassword("alice123");
    await alice.save();

    // Beispiel-Bücher
    await Buch.insertMany([
      {
        titel: "Clean Code",
        autoren: ["Robert C. Martin"],
        status: "LESE",
        notizen: "Gerade bei Kapitel 3",
        besitzer: eylem._id
      },
      {
        titel: "Atomic Habits",
        autoren: ["James Clear"],
        status: "GELESEN",
        bewertung: 5,
        besitzer: alice._id
      },
      {
        titel: "Der Pragmatiker",
        autoren: ["Andrew Hunt", "David Thomas"],
        status: "ZU_LESEN",
        besitzer: eylem._id
      }
    ]);

    console.log("Seeding done.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
  }
}

run();