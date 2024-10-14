import express from "express";
import authCheck from "../middleware/auth.middleware.js";
import adminCheck from "../middleware/admin.middleware.js";
import Problem from "../models/problem.js";
import Team from "../models/team.js";
import mongoose from "mongoose";
import axios from "axios";

const router = express.Router();
router.use(authCheck);

const languages = {
  javascript: {
    image: "node:20-alpine",
    file: "index.js",
    script: "node index.js < input.txt > $TORK_OUTPUT",
  },
  python: {
    image: "python:3.11-alpine",
    file: "main.py",
    script: "python3 main.py < input.txt > $TORK_OUTPUT",
  },
  cpp: {
    image: "gcc:14.2.0",
    file: "main.cpp",
    script: "gcc main.cpp -o main && ./main < input.txt > $TORK_OUTPUT",
  },
  c: {
    image: "gcc:14.2.0",
    file: "main.c",
    script: "gcc main.c -o main && ./main < input.txt > $TORK_OUTPUT",
  },
  java: {
    image: "eclipse-temurin:23_37-jdk-alpine",
    file: "Main.java",
    script: "javac Main.java && java Main < input.txt > $TORK_OUTPUT",
  },
};

const rewards = {
  Easy: 80,
  Medium: 120,
  Hard: 160,
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

router.post("/:id/submit", async (req, res) => {
  const user = req.user;
  const problemId = req.params.id;
  const problem = await Problem.findById(problemId);
  const code = req.body.code;
  const language = req.body.language;
  const f = {};
  f[languages[language].file] = code;
  const tasks = [];

  problem.testCases.forEach((testCase, index) => {
    const t = {
      name: `testcase-${index}`,
      image: languages[language].image,
      files: {
        ...f,
        "input.txt": testCase.input,
      },
      run: languages[language].script,
      limits: {
        cpus: "1",
        memory: "512m",
      },
      timeout: "30s",
    };
    tasks.push(t);
  });
  const job = {
    name: `${problemId}-${user._id}`,
    tasks,
  };
  console.log("Job:", job);
  const response = await axios.post(
    "http://localhost:8000/jobs",
    JSON.stringify(job),
    {
      headers: {
        "Content-Type": "text/yaml",
      },
    },
  );
  console.log("Response:", response.data);

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const status = await axios.get(
      `http://localhost:8000/jobs/${response.data.id}`,
    );
    let data = [];
    if (status.data.state == "RUNNING") {
      continue;
    }
    let successCount = 0;
    const totalCount = tasks.length;

    for (let j = 0; j < tasks.length; j++) {
      let d = { id: j };
      if (j >= status.data.execution.length) {
        d["successful"] = false;
        d["error"] = "Test case not executed";
        d["hidden"] = problem.testCases[j].hidden;
        if (!problem.testCases[j].hidden) {
          d["input"] = problem.testCases[j].input;
          d["expectedOutput"] = problem.testCases[j].expectedOutput;
          d["output"] = "Test case not executed";
        } else {
          d["input"] = "Hidden";
          d["expectedOutput"] = "Hidden";
          d["output"] = "Hidden";
        }
        data.push(d);
        continue;
      }
      if (
        status.data.execution[j].state == "COMPLETED" &&
        status.data.execution[j].result.replace(/(?:\r\n|\r|\n)/g, "") ==
          problem.testCases[j].expectedOutput.replace(/(?:\r\n|\r|\n)/g, "")
      ) {
        d["successful"] = true;
        successCount++;
      } else {
        d["successful"] = false;
        d["error"] = status.data.execution[j].error;
        console.log(status.data.execution[j]);
      }
      d["hidden"] = problem.testCases[j].hidden;
      if (!problem.testCases[j].hidden) {
        d["input"] = problem.testCases[j].input;
        d["expectedOutput"] = problem.testCases[j].expectedOutput;
        d["output"] = status.data.execution[j].result;
      } else {
        d["input"] = "HIDDEN";
        d["expectedOutput"] = "HiDDEN";
        d["output"] = "HIDDEN";
      }
      data.push(d);
    }
    console.log("DATA:", data);
    if (successCount == totalCount) {
      problem.solved = true;
      await problem.save();
    } else {
      req.user.team.wrongSubmissions++;
      await req.user.team.save();
    }
    return res.status(200).json({ data });
  }

  res.status(200).json({ error: "Timeout" });
});

router.post("/:id/run", async (req, res) => {
  const user = req.user;
  const problemId = req.params.id;
  const problem = await Problem.findById(problemId);
  const code = req.body.code;
  const language = req.body.language;
  const f = {};
  f[languages[language].file] = code;
  const tasks = [];

  problem.testCases.forEach((testCase, index) => {
    const t = {
      name: `testcase-${index}`,
      image: languages[language].image,
      files: {
        ...f,
        "input.txt": testCase.input,
      },
      run: languages[language].script,
      limits: {
        cpus: "1",
        memory: "512m",
      },
      timeout: "30s",
    };
    tasks.push(t);
  });
  const job = {
    name: `${problemId}-${user._id}`,
    tasks,
  };
  console.log("Job:", job);
  const response = await axios.post(
    "http://localhost:8000/jobs",
    JSON.stringify(job),
    {
      headers: {
        "Content-Type": "text/yaml",
      },
    },
  );
  console.log("Response:", response.data);

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const status = await axios.get(
      `http://localhost:8000/jobs/${response.data.id}`,
    );
    let data = [];
    if (status.data.state == "RUNNING") {
      continue;
    }
    for (let j = 0; j < tasks.length; j++) {
      let d = { id: j };
      if (j >= status.data.execution.length) {
        d["successful"] = false;
        d["error"] = "Test case not executed";
        d["hidden"] = problem.testCases[j].hidden;
        if (!problem.testCases[j].hidden) {
          d["input"] = problem.testCases[j].input;
          d["expectedOutput"] = problem.testCases[j].expectedOutput;
          d["output"] = "Test case not executed";
        } else {
          d["input"] = "Hidden";
          d["expectedOutput"] = "Hidden";
          d["output"] = "Hidden";
        }
        data.push(d);
        continue;
      }
      if (
        status.data.execution[j].state == "COMPLETED" &&
        status.data.execution[j].result.replace(/(?:\r\n|\r|\n)/g, "") ==
          problem.testCases[j].expectedOutput.replace(/(?:\r\n|\r|\n)/g, "")
      ) {
        d["successful"] = true;
      } else {
        d["successful"] = false;
        d["error"] = status.data.execution[j].error;
        console.log(status.data.execution[j]);
      }
      d["hidden"] = problem.testCases[j].hidden;
      if (!problem.testCases[j].hidden) {
        d["input"] = problem.testCases[j].input;
        d["expectedOutput"] = problem.testCases[j].expectedOutput;
        d["output"] = status.data.execution[j].result;
      } else {
        d["input"] = "HIDDEN";
        d["expectedOutput"] = "HiDDEN";
        d["output"] = "HIDDEN";
      }
      data.push(d);
    }
    console.log("DATA:", data);
    return res.status(200).json({ data });
  }

  res.status(200).json({ error: "Timeout" });
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
