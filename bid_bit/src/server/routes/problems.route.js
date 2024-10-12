import express from "express";
import authCheck from "../middleware/auth.middleware";
import Problem from "../models/problem";

const router = express.Router();
router.use(authCheck);

router.get("/problems", async (req, res) => {
  const user = req.user;
  try {
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

router.get("/problems/:id", async (req, res) => {
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
