import jwt from "jsonwebtoken";
import prisma from "../utils/prisma_client";
import logger from "../utils/logger";

import User from "../models/user";
import Team from "../models/team";

async function authCheck(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({
      error: true,
      message: "A token is required for authentication",
    });
  }
  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
      let user = await User.findOne({
        email: decoded.email,
      }).populate("team");
      req.user = user;
    } catch (err) {
      logger.error(err);
      return res.status(401).json({ error: true, message: "User not found" });
    }
  } catch (err) {
    return res.status(401).json({ error: true, message: "Invalid Token" });
  }
  return next();
}
export default authCheck;
