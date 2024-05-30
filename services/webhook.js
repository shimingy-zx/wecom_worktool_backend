/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-30 14:20:23
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 16:19:18
 * @FilePath: /wecom_worktool_backend/services/webhook.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const axios = require("axios");

async function sedWebhook(text) {
  if (!process.env.WEBHOOK_URL) {
    return;
  }
  try {
    await axios.post(
      process.env.WEBHOOK_URL,
      {
        msgtype: "text",
        text: {
          content: text,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

module.exports = sedWebhook;
