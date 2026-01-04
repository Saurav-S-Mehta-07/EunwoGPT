import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import ChatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

import "./config/passport.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// Tell Express to trust the proxy (important on Render)
app.set("trust proxy", 1);

// Detect frontend origin dynamically
const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://eunwogpt-cb0g.onrender.com" // deployed frontend
    : "http://localhost:3000"; // local dev

// CORS setup
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_ATLAS_URL,
      ttl: 14 * 24 * 60 * 60, // 14 days in seconds
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api", ChatRoutes);
app.use("/api/auth", authRoutes);

// Connect MongoDB
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
});
