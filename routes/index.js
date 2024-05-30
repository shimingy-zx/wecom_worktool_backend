/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:28:02
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 15:20:48
 * @FilePath: /wecom_worktool_backend/routes/index.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const log = require("../services/logger");
const checkKey = require("../middlewares/checkKey");

/* GET home page. */
router.get("/", checkKey, (req, res) => {
  log.info("Visited Home Page");
  res.sendFile(path.join(__dirname, "../public/html", "index.html"));
});

router.get("/enter-key", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "enter-key.html"));
});

router.post("/set-key", (req, res) => {
  const key = req.body.key;
  if (key === process.env.VISIT_KEY) {
    res.cookie("key", key);
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "../public/html", "invalid-key.html"));
  }
});

module.exports = router;
