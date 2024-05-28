/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-28 13:15:35
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-28 13:29:04
 * @FilePath: /wecom_worktool_backend/services/getFilePath.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const getlogFilePath = () => {
  return process.env.ENV_VAR === "tencentcloud" ? "tmp/logs/" : "logs/";
};

const getenvFilePath = () => {
  return process.env.ENV_VAR === "tencentcloud" ? "tmp/.env" : ".env";
};

module.exports = { getlogFilePath, getenvFilePath };
