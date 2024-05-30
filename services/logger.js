/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:29:02
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 15:35:31
 * @FilePath: /wecom_worktool_backend/services/logger.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const winston = require("winston");

const logConfiguration = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    new winston.transports.File({
      filename: "logs/app.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
};

const log = winston.createLogger(logConfiguration);

module.exports = log;
