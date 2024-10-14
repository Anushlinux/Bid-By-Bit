import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js";

const router = express.Router();

router.get("/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}?failure=${400}`,
  }),
  async (req, res) => {
    const user = req.user;

    const accessToken = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.AT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.RT_EXPIRATION },
    );

    const userDB = await User.findById(user.id, {
      refresh_token: refreshToken,
    }).catch((e) => {
      logger.error(e);
      res.redirect(`${process.env.CLIENT_URL}?failure=${500}`);
    });
    let redirectURL;
    switch (userDB.role) {
      case "ADMIN":
        redirectURL = process.env.ADMIN_CLIENT_URL;
        break;
      default:
        redirectURL = process.env.CLIENT_URL;
    }
    res.redirect(
      `${
        redirectURL + process.env.FRONTEND_REDIRECT_PATH
      }?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  },
);

router.get("/github", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&state=${state}&redirect_uri=http://localhost:5173/api/github/callback&scope=repo`;

  res.json({ url: githubAuthUrl, state });
});

router.get("/github/callback", async (req, res) => {
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
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: "http://localhost:5173/api/github/callback",
        },
        headers: {
          Accept: "application/json",
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;

    res.json({ access_token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error exchanging code for access token");
  }
});

export default router;
