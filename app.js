/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-24 20:56:55
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-25 17:54:27
 * @FilePath: /wecom_worktool_backend/app.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const port = 3000;

app.use(bodyParser.json()); // 解析 application/json
app.use(bodyParser.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded

// coze智能体API接口
const coze_robot_url = "https://api.coze.cn/open_api/v2/chat";
// const coze_robot_Id = "23752a9b4c1d4d6ba726d1741cd90d19";
// const coze_robot_pat = "23752a9b4c1d4d6ba726d1741cd90d19";

const worktool_mes_url = "https://api.worktool.ymdyes.cn/wework/sendRawMessage";
const worktool_robot_Id = "23752a9b4c1d4d6ba726d1741cd90d19";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/worktool", async (req, res) => {
  const {
    spoken,
    rawSpoken,
    receivedName,
    groupName,
    groupRemark,
    roomType,
    atMe,
    textType,
  } = req.body;

  // 检测是否是worktool回调接口测试请求
  if (receivedName === "WorkTool" && groupName === "WorkTool") {
    res.send({
      code: 0,
      message: "参数接收成功",
    });
    return;
  }

  // 打印接收到的数据
  console.log("Received data:", req.body);

  if (
    textType === 0 ||
    textType === 2 ||
    textType === 5 ||
    textType === 7 ||
    textType === 9
  ) {
    console.log("信息类型无法回答");
    switch (textType) {
      // 消息类型 0=未知 1=文本 2=图片 5=视频 7=小程序 8=链接 9=文件
      case 0:
        getCustomData("对不起，我无法处理该信息类型");
        break;
      case 2:
        getCustomData("对不起，我无法处理该图片信息类型");
        break;
      case 5:
        getCustomData("对不起，我无法处理该视频信息类型");
        break;
      case 7:
        getCustomData("对不起，我无法处理该小程序信息类型");
        break;
      case 9:
        getCustomData("对不起，我无法处理该文件信息类型");
        break;
      default:
        break;
    }
    return;
  }

  let seconds = 0;
  let chatMessage = null;

  // 判断是否回复
  if (atMe !== "true" && (roomType === 1 || roomType === 3)) {
    console.log("该信息由内部群发送，而且没有@机器人，不做回复");
    return;
  }

  // 请求智能体回答
  getChatResponse(spoken);

  res.writeHead(200, { "Content-Type": "application/json" });

  res.write('{ "code": 0,');
  res.write(' "message": "参数接收成功",');
  res.write(' "data": { "type": 5000,');

  // 设置计时器
  const timer = setInterval(async () => {
    // 如果需要在某个时间点停止计时器，可以使用 clearInterval
    seconds++;
    console.log(`计时：${seconds} 秒`);

    if (seconds < 6 && chatMessage !== null) {
      clearInterval(timer);
      console.log("计时器已停止");

      res.write(` "info": { "text": "${chatMessage}" }`);
      res.write(" } }");
      res.end();

      return;
    }

    if (seconds >= 6 && chatMessage !== null) {
      clearInterval(timer);
      console.log("计时器已停止");

      res.write(` "info": { "text": "" }`);
      res.write(" } }");
      res.end();

      switch (roomType) {
        // QA所在房间类型 1=外部群 2=外部联系人 3=内部群 4=内部联系人
        case 1:
          if (atMe === "true") {
            sendWorktoolMessage(groupRemark, chatMessage);
          }
          break;
        case 2:
          sendWorktoolMessage(receivedName, chatMessage);
          break;
        case 3:
          if (atMe === "true") {
            sendWorktoolMessage(groupRemark, chatMessage);
          }
          break;
        case 4:
          sendWorktoolMessage(receivedName, chatMessage);
          break;
        default:
          console.log("接收到的消息是：其他");
          break;
      }

      return;
    }

    // 例如：30秒后停止计时器
    if (seconds >= 30) {
      clearInterval(timer);
      console.log("请求超时");
      return;
    }
  }, 1000);

  function getCustomData(customText) {
    res.send({
      code: 0,
      message: "参数接收成功",
      data: {
        type: 500,
        info: {
          text: customText,
        },
      },
    });
  }

  // 向coze智能体请求数据
  function getChatResponse(spoken) {
    return axios
      .post(
        coze_robot_url,
        {
          conversation_id: "123",
          bot_id: process.env.COZE_ROBOT_ID,
          user: "29032201862555",
          query: spoken,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.COZE_ROBOT_PAT}`,
          },
        }
      )
      .then((response) => {
        chatMessage = response.data.messages[0].content;
      })
      .catch((error) => {
        console.error("Error processing request:", error);
        throw error;
      });
  }

  // 向企业微信发送信息
  async function sendWorktoolMessage(receivedName, chatMessage) {
    try {
      await axios.post(
        worktool_mes_url,
        {
          socketType: 2,
          list: [
            {
              type: 203,
              titleList: [receivedName], // 替换为实际的微信昵称或群名
              receivedContent: chatMessage,
            },
          ],
        },
        {
          params: {
            robotId: worktool_robot_Id,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ code: -1, message: "处理请求时出错" });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
