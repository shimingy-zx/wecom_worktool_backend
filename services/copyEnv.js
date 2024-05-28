/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-28 13:40:08
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-28 13:44:58
 * @FilePath: /wecom_worktool_backend/services/copyEnv.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

// copyEnv.js
const fs = require("fs");
const path = require("path");

function copyEnvFile() {
  if (process.env.ENV_VAR === "tencentcloud") {
    const src = path.join(__dirname, "../.env");
    const destDir = path.join(__dirname, "../tmp");
    const dest = path.join(destDir, ".env");

    // Ensure tmp directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
    }

    // Copy .env file to tmp directory
    fs.copyFile(src, dest, (err) => {
      if (err) {
        console.error("Error copying .env file:", err);
      } else {
        console.log(".env file copied to tmp/.env");
      }
    });
  } else {
    console.log("ENV_VAR is not tencentcloud, skipping .env file copy.");
  }
}

module.exports = copyEnvFile;
