/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-29 04:01:39
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 15:47:35
 * @FilePath: /wecom_worktool_backend/services/logHelper.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const log = require("./logger");
const sedWebhook = require("./webhook");

const logUserQuestion = async (body) => {
  const {
    spoken,
    rawSpoken,
    receivedName,
    groupName,
    groupRemark,
    roomType,
    atMe,
    textType,
  } = body;

  let roomTypeDesc;
  switch (roomType) {
    case 1:
      roomTypeDesc = "外部群";
      break;
    case 2:
      roomTypeDesc = "外部联系人";
      break;
    case 3:
      roomTypeDesc = "内部群";
      break;
    case 4:
      roomTypeDesc = "内部联系人";
      break;
    default:
      roomTypeDesc = "未知类型";
  }

  const messageTypeDesc = (type) => {
    switch (type) {
      case 1:
        return "文本";
      case 2:
        return "图片";
      case 3:
        return "语音";
      case 5:
        return "视频";
      case 7:
        return "小程序";
      case 8:
        return "链接";
      case 9:
        return "文件";
      case 13:
        return "合并记录";
      case 15:
        return "带回复文本";
      default:
        return "未知";
    }
  };

  const logMessage = `提问用户：<${receivedName}>\n问题：${spoken}，\n【是否@：${atMe}，--消息类型：${messageTypeDesc(
    textType
  )}】`;

  if (groupName === "") {
    log.info(logMessage);
    sedWebhook(logMessage);
  } else {
    const mes = `群聊：<${groupName}>\n【备注名：${groupRemark}，群类型：${roomTypeDesc}】${logMessage}\n`;
    log.info(mes);
    sedWebhook(mes);
  }
};

module.exports = {
  logUserQuestion,
};
