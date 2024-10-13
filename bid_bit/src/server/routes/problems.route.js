import express from "express";
import authCheck from "../middleware/auth.middleware.js";
import adminCheck from "../middleware/admin.middleware.js";
import Problem from "../models/problem.js";
import Team from "../models/team.js";
import mongoose from "mongoose";
import axios from "axios";

const router = express.Router();
router.use(authCheck);

const images = {
  javascript: "node:20-alpine",
  python: "python:3.11-alpine",
};

router.post("/", async (req, res) => {
  if (req.user.role != "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const problem = new Problem({
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      tags: req.body.tags,
      testCases: req.body.testCases,
      createdBy: req.user._id,
      _id: new mongoose.Types.ObjectId(),
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

router.get("/", async (req, res) => {
  const user = req.user;
  try {
    console.log(user);
    await user.team.populate("problems");
    const problems = user.team.problems;
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  if (req.user.role != "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      difficulty: req.body.difficulty,
      tags: req.body.tags,
      testCases: req.body.testCases,
    });
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/run", async (req, res) => {
  const user = req.user;
  const problemId = req.params.id;
  const code = req.body.code;
  const language = req.body.language;
  const job = {
    name: `${problemId}-${user._id}`,
    tasks: [
      {
        name: `testcase-1`,
        image: images[language],
        files: {
          "index.js": code,
        },
        run: "node index.js > $TORK_OUTPUT",
      },
    ],
  };
  const response = await axios.post(
    "http://localhost:8000/jobs",
    JSON.stringify(job),
    {
      headers: {
        "Content-Type": "text/yaml",
      },
    },
  );
});

router.post("/:id/submit", (req, res) => {
  const user = req.user;
  const problemId = req.params.id;
  const code = req.body.code;
  const language = req.body.language;
});

router.post("/:id/allocate", adminCheck, async (req, res) => {
  const newTeamId = req.body.teamId;
  const problemId = req.params.id;

  const newTeam = await Team.findById(newTeamId);
  if (!newTeam) {
    return res.status(404).json({ error: "Team not found" });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }
  if (newTeam.problems.includes(problemId)) {
    return res
      .status(400)
      .json({ error: "Same problem already allocated to this team" });
  }

  const oldTeamId = problem.team;

  if (oldTeamId) {
    const oldTeam = await Team.findById(oldTeamId);
    oldTeam.problems = oldTeam.problems.filter((id) => id != problemId);
    await oldTeam.save();
  }
  problem.team = newTeamId;
  newTeam.problems.push(problemId);
  await newTeam.save();
  res.status(200).json(newTeam);
});

export default router;
