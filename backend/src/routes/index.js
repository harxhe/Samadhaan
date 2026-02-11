const express = require("express");

const healthRouter = require("./health");
const complaintsRouter = require("./complaints");

const router = express.Router();

router.use("/health", healthRouter);
router.use("/complaints", complaintsRouter);

module.exports = router;
