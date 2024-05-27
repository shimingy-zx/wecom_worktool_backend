/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:31:07
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-27 17:10:52
 * @FilePath: /wecom_worktool_backend/routes/env.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const checkKey = require("../middlewares/checkKey");

router.get("/env", checkKey, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "env.html"));
});

router.get("/api/env", checkKey, (req, res) => {
  try {
    const envVariables = loadEnvFile();
    res.json(envVariables);
  } catch (err) {
    res.status(500).json({ message: "Error reading .env file." });
  }
});

router.post("/api/env", checkKey, (req, res) => {
  const { key, value } = req.body;
  if (key && value) {
    try {
      const envVariables = loadEnvFile();
      const existingVar = envVariables.find((envVar) => envVar.key === key);
      if (existingVar) {
        existingVar.value = value;
      } else {
        envVariables.push({ key, value });
      }
      saveEnv(envVariables);

      res.json({ message: "Environment variable set successfully." });
    } catch (err) {
      res.status(500).json({ message: "Error saving environment variable." });
    }
  } else {
    res.status(400).json({ message: "Key and value are required." });
  }
});

router.delete("/api/env", checkKey, (req, res) => {
  const { key } = req.body;
  if (key) {
    try {
      let envVariables = loadEnvFile();
      envVariables = envVariables.filter((envVar) => envVar.key !== key);
      saveEnv(envVariables);
      res.json({ message: "Environment variable deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Error deleting environment variable." });
    }
  } else {
    res.status(400).json({ message: "Key is required." });
  }
});

function loadEnvFile() {
  const envVariables = [];
  if (fs.existsSync(".env")) {
    const envFileContent = fs.readFileSync(".env", "utf-8");
    envFileContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVariables.push({ key, value });
      }
    });
  }
  return envVariables;
}

function saveEnv(envVariables) {
  const envContent = envVariables
    .map(({ key, value }) => `${key}=${value}`)
    .join("\n");
  fs.writeFileSync(".env", envContent);
  // 重新加载 .env 文件中的环境变量
  reloadEnv();
  console.log(process.env.VISIT_KEY);
}

function reloadEnv() {
  const envConfig = dotenv.parse(fs.readFileSync(".env"));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

module.exports = router;
