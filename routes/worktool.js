/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:32:18
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-27 23:35:09
 * @FilePath: /wecom_worktool_backend/routes/worktool.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();

const {
  getChatResponse,
  sendWorktoolMessageBasedOnRoomType,
} = require("../services/chatService");
const logger = require("../config/logger"); // 导入logger模块

/* POST worktool listing. */
router.post("/", async (req, res) => {
  const {
    spoken,
    receivedName,
    groupName,
    groupRemark,
    roomType,
    atMe,
    textType,
  } = req.body;

  // 打印接收到的数据
  console.log("Received data:", req.body);

  // 判断是否为平台回调函数配置校验
  if (receivedName === "WorkTool" && groupName === "WorkTool") {
    console.log("该请求为平台回调函数配置校验，不做具体操作！");
    res.send({
      code: 0,
      message: "参数接收成功",
    });
    return;
  }

  // roomType：QA所在房间类型 1=外部群 2=外部联系人 3=内部群 4=内部联系人
  // 消息类型： 0=未知 1=文本 2=图片 5=视频 7=小程序 8=链接 9=文件
  // 信息类型识别，决定是否回复信息
  // 当内外部联系人私聊AI机器人，且信息类型为0, 2, 5, 7, 9时，回复无法处理该信息。
  // 当内外部群聊@AI机器人，且信息类型为0, 2, 5, 7, 9时，回复无法处理该信息。

  if (
    ([2, 4].includes(roomType) && [0, 2, 5, 7, 9].includes(textType)) ||
    ([1, 3].includes(roomType) &&
      atMe == "true" &&
      [0, 2, 5, 7, 9].includes(textType))
  ) {
    const messageMap = {
      0: "对不起，我无法处理该信息类型",
      2: "对不起，我无法处理该图片信息类型",
      5: "对不起，我无法处理该视频信息类型",
      7: "对不起，我无法处理该小程序信息类型",
      9: "对不起，我无法处理该文件信息类型",
    };

    res.send({
      code: 0,
      message: "参数接收成功",
      data: {
        type: 500,
        info: {
          text: messageMap[textType],
        },
      },
    });
    return;
  }

  // 判断是否回复
  if (atMe !== "true" && [1, 3].includes(roomType)) {
    console.log("该信息由内部群发送，而且没有@机器人，不做回复");
    return;
  }

  let chatMessage = null;

  // 获取AI回复
  getChatResponse(spoken)
    .then((response) => {
      chatMessage = response;
    })
    .catch((error) => {
      console.error("Error processing request:", error);
    });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write('{ "code": 0, "message": "参数接收成功", "data": { "type": 5000,');

  let seconds = 0;
  const timer = setInterval(() => {
    seconds++;
    console.log(`计时：${seconds} 秒`);

    // 当6秒内AI可以正常回复时
    if (seconds < 6 && chatMessage !== null) {
      clearInterval(timer);
      console.log("相应时间小于6秒，计时器已停止！");

      res.write(` "info": { "text": "${chatMessage}" }`);
      res.write(" } }");
      res.end();

      return;
    }

    if (seconds >= 6 && chatMessage !== null) {
      clearInterval(timer);
      console.log("计时器已停止");

      res.write(` "info": { "text": "${chatMessage}" } } }`);
      res.end();

      sendWorktoolMessageBasedOnRoomType(
        roomType,
        atMe,
        receivedName,
        groupRemark,
        chatMessage
      );
      return;
    }

    // 当AI响应时间大于30秒时，放弃回复信息
    if (seconds >= 30) {
      clearInterval(timer);
      console.log("请求超时");
      res.write(' "info": { "text": "" } } }');
      res.end();
    }
  }, 1000);
});

module.exports = router;
