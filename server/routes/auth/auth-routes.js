const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkUserauthMiddleware,
} = require("../../controllers/auth/auth-controller");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.get("/checkuser", checkUserauthMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user,
  });
});

module.exports = router;
