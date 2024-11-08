const express = require("express");
const router = express.Router();
const {
  createSession,
  joinSession,
} = require("../../controllers/session/sessionController");

router.post("/create", createSession);
router.post("/join/:sessionId", joinSession);

module.exports = router;
