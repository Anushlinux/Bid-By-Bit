import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

import User from "./models/user";
import Team from "./models/team";
import Problem from "./models/problem";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Connect to MongoDB database
mongoose
  .connect(
    "mongodb+srv://anushrutp:sherlock@bidbybitdb.cxzwf.mongodb.net/?retryWrites=true&w=majority&appName=bidbybitdb",
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

//github auth
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = User.findOne({ email: profile.emails[0].value });
        return done(null, user);
      } catch (e) {
        let email = profile.emails[0].value;
        try {
          let user = User.create({
            name: profile.displayName,
            email: email,
            photo_url: profile.photos[0].value,
            role: "USER",
          });
          return done(null, user);
        } catch (err) {
          logger.error(err);
          return done(new Error("error fetching/creating user"), null);
        }
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (user, done) => {
  try {
    const p = await User.findOne({ email: user.email });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

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
      { new: true },
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
    // const response = await axios.post("http://localhost:8000/api/execute", {
    //   code: code,
    //   language: language,
    // });
    console.log(typeof code);
    const job = {
      name: "Sample job",
      tasks: [
        {
          name: "Task 1",
          image: "node:20-alpine",
          files: {
            "index.js": code,
          },
          run: "node index.js > $TORK_OUTPUT",
        },
      ],
    };
    console.log(job);
    const response = await axios.post(
      "http://localhost:8000/jobs",
      JSON.stringify(job),
      {
        headers: {
          "Content-Type": "text/yaml",
        },
      },
    );
    // Send the response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error calling Go service:", error.message);
    res.status(500).json({ message: "Error executing code" });
  }
});

app.get("/", async (req, res) => {
  res.send("Welcome to my User Registration and Login API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
