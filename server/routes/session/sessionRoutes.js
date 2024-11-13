const express = require("express");
const router = express.Router();
const {
  createSession,
  joinSession,
  fetchSession,
} = require("../../controllers/session/sessionController");

router.post("/create", createSession);
router.post("/join/:sessionId", joinSession);
router.get("/get", fetchSession);

module.exports = router;
