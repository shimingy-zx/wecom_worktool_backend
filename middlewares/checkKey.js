/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:30:37
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-26 02:31:45
 * @FilePath: /wecom_worktool_backend/middlewares/checkKey.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const { correctKey } = require("../config/keys");

function checkKey(req, res, next) {
  const key = req.cookies.key;
  if (key === correctKey) {
    next();
  } else {
    res.redirect("/enter-key");
  }
}

module.exports = checkKey;
