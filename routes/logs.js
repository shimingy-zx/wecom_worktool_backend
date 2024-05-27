/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:31:07
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-26 22:47:42
 * @FilePath: /wecom_worktool_backend/routes/logs.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs"); // 添加这一行
const checkKey = require("../middlewares/checkKey");

router.get("/logs", checkKey, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "logs.html"));
});

router.get("/logs_data", checkKey, (req, res) => {
  const logFilePath = path.join(__dirname, "../logs", "app.log");
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading log file:", err);
      res.status(500).send("Error reading log file.");
      return;
    }
    res.send(data);
  });
});

module.exports = router;
