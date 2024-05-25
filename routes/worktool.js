/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:32:18
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-25 21:17:24
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
router.post("/worktool", async (req, res) => {
  const {
    spoken,
    receivedName,
    groupName,
    groupRemark,
    roomType,
    atMe,
    textType,
  } = req.body;

  if (receivedName === "WorkTool" && groupName === "WorkTool") {
    res.send({
      code: 0,
      message: "参数接收成功",
    });
    return;
  }

  // 打印接收到的数据
  console.log("Received data:", req.body);

  if ([0, 2, 5, 7, 9].includes(textType)) {
    // 消息类型 0=未知 1=文本 2=图片 5=视频 7=小程序 8=链接 9=文件
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

  let seconds = 0;
  let chatMessage = null;

  getChatResponse(spoken)
    .then((response) => {
      chatMessage = response;
    })
    .catch((error) => {
      console.error("Error processing request:", error);
    });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.write('{ "code": 0, "message": "参数接收成功", "data": { "type": 5000,');

  const timer = setInterval(() => {
    seconds++;
    console.log(`计时：${seconds} 秒`);

    if (chatMessage !== null) {
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

    if (seconds >= 30) {
      clearInterval(timer);
      console.log("请求超时");
      res.write(' "info": { "text": "" } } }');
      res.end();
    }
  }, 1000);
});

module.exports = router;
