
const express = require("express");
const { handleGenerateNewShortURLL, handleGetAnalytics } = require("../controller/url");
const router = express.Router();

router.post("/", handleGenerateNewShortURLL);
router.get("/analytics/:shortID", handleGetAnalytics);

module.exports = router;
