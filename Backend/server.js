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

app.set("trust proxy", 1);

const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://eunwogpt-cb0g.onrender.com" 
    : "http://localhost:5173";


app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_ATLAS_URL,
      ttl: 7 * 24 * 60 * 60, 
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", ChatRoutes);
app.use("/api/auth", authRoutes);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_ATLAS_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
});
