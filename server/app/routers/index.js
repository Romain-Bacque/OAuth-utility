const express = require("express");
const router = express.Router();
const { getUrl, getAccess } = require("../controllers/auth.js");

router.get("/getUrl", getUrl);
router.post("/getAccess", getAccess);

module.exports = router;
