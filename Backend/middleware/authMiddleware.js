
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("authenticate")
    return next();
  } 
  console.log("not authenticate");
  return res.status(401).json({ error: "Unauthorized" });
};
