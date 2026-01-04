import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import ChatRoutes from "./routes/chat.js";

import "./config/passport.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT||8080;
const app = express();

app.use(cors({
  origin: "https://eunwogpt-cb0g.onrender.com", 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_ATLAS_URL
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,
      httpOnly: true,
      secure: true,
      sameSite: "none"
    }
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






// app.get("/chat", async (req, res) => {
//   const message = req.query.message;
//   if (!message) return res.status(400).json({ error: "Message is required" });

//   try {
//     const response = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a helpful assistant like ChatGPT. Keep responses concise, clear, and short. Only provide code if asked. Always use plain text formatting.",
//         },
//         { role: "user", content: message },
//       ],
//     });

//     const answer = response.choices?.[0]?.message?.content || "No response generated.";
//     res.json({ reply: answer });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/test", async (req, res) => {
//   try {
//     const response = await groq.chat.completions.create({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     });
//     let reply = response.choices[0].message.content;
//     res.json(reply);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "API error" });
//   }
// });

