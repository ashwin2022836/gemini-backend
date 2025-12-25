console.log("fetch BEFORE imports:", typeof global.fetch);

const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();
console.log("🔑 API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("BACKEND fetch type:", typeof fetch);
console.log("fetch AFTER imports:", typeof global.fetch);



const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    console.log("🔥 RAW BODY:", req.body);

    const userMessage = req.body.prompt;

    if (!userMessage || typeof userMessage !== "string") {
      console.log("❌ INVALID MESSAGE");
      return res.status(400).json({ error: "Empty or invalid prompt" });
    }

    console.log("➡️ Sending to Gemini:", userMessage);

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userMessage }] }]
    })
  }
);s



    return res.json(data);

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
});


app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
