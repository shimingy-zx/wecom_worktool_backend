/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:28:02
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-26 22:49:52
 * @FilePath: /wecom_worktool_backend/routes/index.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const logger = require("../config/logger");
const checkKey = require("../middlewares/checkKey");

/* GET home page. */
router.get("/", checkKey, (req, res) => {
  logger.info("Visited Home Page");
  res.sendFile(path.join(__dirname, "../public/html", "index.html"));
});

router.get("/enter-key", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "enter-key.html"));
});

router.post("/set-key", (req, res) => {
  const { correctKey } = require("../config/keys");
  const key = req.body.key;
  if (key === correctKey) {
    res.cookie("key", key);
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "../public/html", "invalid-key.html"));
  }
});

module.exports = router;
