import express from "express";
import authCheck from "../middleware/auth.middleware.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/me", authCheck, (req, res, next) => {
  console.log(req.user);
  res.json(req.user);
});

export default router;
