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
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ]
    })
  }
);



    console.log("📡 Gemini HTTP status:", response.status);

    const data = await response.json();

    console.log("🔵 GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    return res.json(data);

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
});


app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
