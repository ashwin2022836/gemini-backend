console.log("fetch BEFORE imports:", typeof global.fetch);

const express = require("express");
const cors = require("cors");
// const fetch = require("node-fetch");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");


// dot env Configuration
dotenv.config();
// console.log("🔑 API KEY LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");
// console.log("BACKEND fetch type:", typeof fetch);
// console.log("fetch AFTER imports:", typeof global.fetch);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

const usersFile = path.join(__dirname, "users.json");

// Helper to read users
const readUsers = () => {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, "utf8"));
};

// Helper to write users
const writeUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const users = readUsers();
  if (users.find(u => u.username === username)) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  writeUsers(users);
  res.json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required" });

  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/chat", authenticate, async (req, res) => {
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
// console.log("🔵 GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));
res.json(data);


  } catch (error) {
    res.status(500).json({ error: error.message });
    
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
