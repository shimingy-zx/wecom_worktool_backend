/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-24 20:56:55
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-24 20:57:06
 * @FilePath: /wecom_worktool_backend/app.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
