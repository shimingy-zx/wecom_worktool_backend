/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:32:18
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-29 05:06:19
 * @FilePath: /wecom_worktool_backend/routes/worktool.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();
const ProgressBar = require("progress");
const { executeWithDelay } = require("../services/delay");

const { getChatResponse, sendType } = require("../services/chatService");
const log = require("../config/logger"); // 导入logger模块
const { logUserQuestion } = require("../services/logHelper"); // 导入logHelper模块

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
  logUserQuestion(req.body);

  // 判断是否为平台回调函数配置校验
  if (receivedName === "WorkTool" && groupName === "WorkTool") {
    log.info("该请求为平台回调函数配置校验，不做具体操作！");

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

    log.info(messageMap[textType]);

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
    log.info("该信息由内部群发送，而且没有@机器人，不做回复!");
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

  const bar = new ProgressBar(":bar :percent :etas", {
    total: 300,
    clear: true,
  });

  log.info("响应倒计时30秒!");

  for (let freq = 0; freq <= 3000; freq++) {
    // console.log(`计时：${freq}*100ms `);
    bar.tick();
    // bar.complete

    // 当6秒内AI可以正常回复时，经过测试worktool在10秒内回复可以正常调用。
    if (freq < 60 && chatMessage !== null) {
      log.info("响应时间小于6秒，选择直接回复！");

      res.send({
        code: 0,
        message: "参数接收成功",
        data: {
          type: 500,
          info: {
            text: chatMessage,
          },
        },
      });

      return;
    }

    if (freq >= 60 && chatMessage !== null) {
      log.info("响应时间大于6秒，选择调用接口回复！");

      res.send({
        code: 0,
        message: "参数接收成功",
      });

      sendType(
        roomType,
        atMe,
        receivedName,
        groupRemark,
        groupName,
        chatMessage
      );

      return;
    }

    // 当AI响应时间大于30秒时，放弃回复信息
    if (freq >= 300) {
      log.info("响应时间大于30秒，回复超时！");

      sendType(
        roomType,
        atMe,
        receivedName,
        groupRemark,
        groupName,
        "回复超时，请稍后重试！"
      );
      return;
    }
    // 延迟100ms
    await executeWithDelay();
  }
});

module.exports = router;
