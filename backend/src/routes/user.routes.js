const {
  register,
  login,
  googleAuth,
  refreshAccessToken,
  logout,
} = require("../controllers/user.controller");
const { Router } = require("express");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;
