import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

app.get("/test-auth", (req, res) => {
  res.json({
    isAuth: req.isAuthenticated(),
    session: req.session,
    user: req.user
  });
});


router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email });
    await User.register(user, password);
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }

      return res.json({
        message: "Login successful",
        user
      });
    });
  })(req, res, next);
});



router.post("/logout", (req, res) => {
  req.logout(() => {
    try{
     res.json({ message: "Logged out successfully" });
    }
    catch(err){
      res.json({error:"something went wrong"});
    }
  });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

export default router;
