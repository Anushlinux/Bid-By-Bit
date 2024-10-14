import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Team from "../models/team.js";

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
    let user = await User.findById(decoded.user_id);
    if (user) {
      if (user.team) {
        user.team = await Team.findById(user.team);
      }
      req.user = user;
    } else {
      console.log(user);
      return res.status(401).json({ error: true, message: "User not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: true, message: "Invalid Token" });
  }
  return next();
}
export default authCheck;
