const express = require("express");
const router = express.Router();
const {
  createSession,
  joinSession,
  fetchSession,
  endSession,
  leaveSession,
} = require("../../controllers/session/sessionController");

router.post("/create", createSession);
router.post("/join/:sessionId", joinSession);
router.get("/get", fetchSession);
router.post("/end", endSession);
router.post("/leave", leaveSession);

module.exports = router;
