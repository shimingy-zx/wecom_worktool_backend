/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-28 02:18:40
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-28 02:38:53
 * @FilePath: /wecom_worktool_backend/services/delay.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeWithDelay() {
  await delay(100);
}

module.exports = { delay, executeWithDelay };
