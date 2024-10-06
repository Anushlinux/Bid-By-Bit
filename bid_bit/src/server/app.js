import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";



dotenv.config();

const app = express();
app.use(express.json());
const PORT = 5000;


app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://anushrutp:sherlock@bidbybitdb.cxzwf.mongodb.net/?retryWrites=true&w=majority&appName=bidbybitdb"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Define a schema for the User collection
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

//github auth
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.get("/api/github/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&state=${state}&redirect_uri=http://localhost:5173/api/github/callback&scope=repo`;

  res.json({ url: githubAuthUrl, state });
});

app.get("/api/github/callback", async (req, res) => {
  const { code, state: receivedState } = req.query;

  const storedState = localStorage.getItem("latestCSRFToken");
  if (receivedState !== storedState) {
    return res.status(403).send("CSRF validation failed");
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: "http://localhost:5173/api/github/callback",
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    res.json({ access_token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error exchanging code for access token");
  }
});

// Create a User model based on the schema
const User = mongoose.model("User", userSchema);

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware for JWT validation
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };
    next();
  });
};

const adminCheck = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

// Route to register a new user
app.post("/api/register", async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to authenticate and log in a user
app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, isAdmin: user.isAdmin },
      "secret"
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route to get user details
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    // Fetch user details using decoded token
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

import Problem from "./models/problem.js";

// Create a new problem (Admins only)
app.post("/api/problems", verifyToken, adminCheck, async (req, res) => {
  try {
    const problem = new Problem({
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      tags: req.body.tags,
      testCases: req.body.testCases,
      createdBy: req.user._id,
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error("Error creating problem:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// Get all problems
app.get("/api/problems", async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/api/problems/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a problem (Admins only)
app.put("/api/problems/:id", verifyToken, adminCheck, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty,
        tags: req.body.tags,
        testCases: req.body.testCases,
      },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a problem (Admins only)
app.delete("/api/problems/:id", verifyToken, adminCheck, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/api/execute", async (req, res) => {
  const { code, language } = req.body;

  try {
    // Make a request to the Go service running on port 9000
    const response = await axios.post("http://localhost:9000/api/execute", {
      code: code,
      language: language,
    });

    // Send the response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calling Go service:", error.message);
    res.status(500).json({ message: "Error executing code" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to my User Registration and Login API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
