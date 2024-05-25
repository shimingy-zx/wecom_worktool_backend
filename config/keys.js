/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:30:06
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-26 02:51:16
 * @FilePath: /wecom_worktool_backend/config/keys.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

// let correctKey = process.env.VISIT_KEY;

// const updateCorrectKey = () => {
//   const newKey = process.env.VISIT_KEY;
//   if (newKey !== correctKey) {
//     correctKey = newKey;
//     console.log("correctKey has been updated:", correctKey);
//   }
// };

// setInterval(updateCorrectKey, 10000); // 每10秒检查一次环境变量

// module.exports = {
//   getCorrectKey: () => correctKey,
// };

module.exports = {
  correctKey: process.env.VISIT_KEY,
};
