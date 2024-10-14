export default function adminCheck(req, res, next) {
  if (req.user.role != "ADMIN") {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}
