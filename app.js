/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-24 20:56:55
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-25 23:12:55
 * @FilePath: /wecom_worktool_backend/app.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = 3000;
const logger = require("./config/logger"); // 导入logger模块

const indexRouter = require("./routes/index");
const logsRouter = require("./routes/logs");
const worktoolRouter = require("./routes/worktool");
const envRouter = require("./routes/env");

app.use(bodyParser.json()); // 解析 application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/", logsRouter);
app.use("/", worktoolRouter);
app.use("/", envRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  logger.info(`Server is running on http://localhost:${port}`);
});

module.exports = app;
