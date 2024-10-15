import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import https from "https";
import fs from "fs";

import User from "./models/user.js";

import authRoutes from "./routes/auth.route.js";
import problemsRoutes from "./routes/problems.route.js";
import teamsRoutes from "./routes/teams.route.js";
import userRouter from "./routes/user.route.js";

const app = express();
app.use(express.json());
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        return done(null, user);
      } else {
        let email = profile.emails[0].value;
        try {
          let user = await User.create({
            name: profile.displayName,
            email: email,
            photo_url: profile.photos[0].value,
            role: "USER",
            _id: new mongoose.Types.ObjectId(),
          });
          return done(null, user);
        } catch (err) {
          console.error(err);
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
app.use(passport.initialize());
app.use(
  session({ secret: "secretkey", resave: false, saveUninitialized: true }),
);
app.use(passport.session());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  res.send("Welcome to my User Registration and Login API!");
});

if (process.env.NODE_ENV !== "PRODUCTION") {
  const port = process.env.PORT || PORT;
  app.listen(port, () => logger.debug(`Server started on port ${port}`));
} else {
  const httpsOptions = {
    key: fs.readFileSync("./cert/privkey.pem"),
    cert: fs.readFileSync("./cert/fullchain.pem"),
  };

  https.createServer(httpsOptions, app).listen(443, () => {
    console.log("Server started on https://localhost:443");
  });
}
