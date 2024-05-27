/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:30:37
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-27 17:23:33
 * @FilePath: /wecom_worktool_backend/middlewares/checkKey.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */


function checkKey(req, res, next) {
  const key = req.cookies.key;
  if (key === process.env.VISIT_KEY) {
    next();
  } else {
    res.redirect("/enter-key");
  }
}

module.exports = checkKey;
