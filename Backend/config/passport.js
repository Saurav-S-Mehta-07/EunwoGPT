import passport from "passport";
import User from "../models/User.js";

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
