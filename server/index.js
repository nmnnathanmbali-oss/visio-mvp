import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

const { DAILY_API_KEY, DAILY_DOMAIN, PORT = 4000 } = process.env;

if (!DAILY_API_KEY || !DAILY_DOMAIN) {
  console.error("❌ DAILY_API_KEY ou DAILY_DOMAIN manquant dans .env");
  process.exit(1);
}

const DAILY_API_BASE = "https://api.daily.co/v1";

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/rooms", async (_req, res) => {
  try {
    const name = `room-${Date.now()}`;

    const response = await fetch(`${DAILY_API_BASE}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`
      },
      body: JSON.stringify({
        name,
        properties: {
          max_participants: 6,
          enable_screenshare: true,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json({
      name: data.name,
      url: data.url
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
