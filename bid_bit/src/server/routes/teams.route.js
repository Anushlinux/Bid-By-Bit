import express from "express";
import mongoose from "mongoose";

import authCheck from "../middleware/auth.middleware.js";
import adminCheck from "../middleware/admin.middleware.js";

import Team from "../models/team.js";
import User from "../models/user.js";

const router = express.Router();

router.use(authCheck);

router.post("/", adminCheck, async (req, res) => {
  try {
    const team = new Team({
      name: req.body.name,
      _id: new mongoose.Types.ObjectId(),
    });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/", adminCheck, async (req, res) => {
  try {
    const teams = await Team.find().populate(["members", "problems"]);
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.get("/:id", adminCheck, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate([
      "members",
      "problems",
    ]);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.put("/:id", adminCheck, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    team.name = req.body.name;
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    console.error("Error updating team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.delete("/:id", adminCheck, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    await team.deleteOne();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.post("/:id/members", adminCheck, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    const memberId = req.body.memberId;
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (team.members.includes(memberId)) {
      return res.status(400).json({ error: "Member already in team" });
    }
    team.members.push(memberId);
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    console.error("Error adding member to team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

router.delete("/:id/members/:memberId", adminCheck, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    const memberIndex = team.members.indexOf(req.params.memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
    team.members.splice(memberIndex, 1);
    await team.save();
    res.status(204).end();
  } catch (error) {
    console.error("Error removing member from team:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

export default router;
