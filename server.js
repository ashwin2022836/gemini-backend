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
    const userMessage = req.body.prompt;

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



const data = await response.json();
console.log("🔵 GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));
res.json(data);


  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
