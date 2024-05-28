/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:29:02
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-28 13:26:26
 * @FilePath: /wecom_worktool_backend/config/logger.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const winston = require("winston");
const { getlogFilePath } = require("../services/getFilePath");

const logConfiguration = {
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${getlogFilePath()}app.log` }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
};

const logger = winston.createLogger(logConfiguration);

module.exports = logger;
