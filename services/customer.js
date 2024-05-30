/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-30 17:34:21
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 18:11:56
 * @FilePath: /wecom_worktool_backend/services/customer.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const { sendfile } = require("./chatService");

function customer(mes) {
  const fileUrl = "https://img2.imgtp.com/2024/05/30/kbizQPVN.png";
  const fileType = "image";
  const extraText = "请根据图片的二维码添加人工客服。";
  const objectName = "zhaofanwecom";

  const {
    spoken,
    receivedName,
    groupName,
    groupRemark,
    roomType,
    atMe,
    textType,
  } = mes;

  if (roomType === 1 && atMe === "true") {
    sendfile(groupName, fileUrl, fileType, extraText, objectName);
  } else if (roomType === 2 || roomType === 4) {
    sendfile(receivedName, fileUrl, fileType, extraText, objectName);
  } else if (roomType === 3 && atMe === "true") {
    sendfile(groupName, fileUrl, fileType, extraText, objectName);
  }
}

function iscustomer(mes) {
  const mesInclude = ["人工"];

  if (mesInclude.includes(mes)) {
    return true;
  } else {
    return false;
  }
}

module.exports = { iscustomer, customer };
