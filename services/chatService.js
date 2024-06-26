/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:33:14
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-30 18:12:34
 * @FilePath: /wecom_worktool_backend/services/chatService.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const axios = require("axios");
const log = require("./logger"); // 导入logger模块

// 获取COZE_AI智能体回复
async function getChatResponse(spoken) {
  try {
    const response = await axios.post(
      process.env.COZE_ROBOT_URL,
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
    );

    // Extract the content of the "answer" message
    const answerMessage = response.data.messages.find(
      (message) => message.type === "answer"
    ).content;

    const followUpMessages = response.data.messages
      .filter((message) => message.type === "follow_up")
      .map((message, index) => `${index + 1}、${message.content}`)
      .join("\n");

    // Format the result
    let result = `${answerMessage}`;
    if (followUpMessages && process.env.IS_SED_RECOMMEND === "true") {
      result += `\n\n猜你想问：\n${followUpMessages}`;
    }

    log.info(`回复内容:\n：${result}`);

    return result;
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

// 向企业微信内外部群聊发送信息
async function sendMessageGroup(titleList, atList, chatMessage) {
  try {
    await axios.post(
      process.env.WORKTOOL_MES_URL,
      {
        socketType: 2,
        list: [
          {
            type: 203,
            titleList: [titleList],
            receivedContent: chatMessage,
            atList: [atList],
          },
        ],
      },
      {
        params: { robotId: process.env.WORKTOOL_ROBOT_ID },
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

// 向企业微信联系人发送信息
async function sendMessageUser(titleList, chatMessage) {
  try {
    await axios.post(
      process.env.WORKTOOL_MES_URL,
      {
        socketType: 2,
        list: [
          {
            type: 203,
            titleList: [titleList],
            receivedContent: chatMessage,
          },
        ],
      },
      {
        params: { robotId: process.env.WORKTOOL_ROBOT_ID },
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

// 向企业微信发送文件
async function sendfile(titleList, fileUrl, fileType, extraText, objectName) {
  try {
    await axios.post(
      process.env.WORKTOOL_MES_URL,
      {
        socketType: 2,
        list: [
          {
            type: 218,
            objectName,
            titleList: [titleList],
            fileUrl,
            fileType,
            extraText,
          },
        ],
      },
      {
        params: { robotId: process.env.WORKTOOL_ROBOT_ID },
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

function sendType(
  roomType,
  atMe,
  receivedName,
  groupRemark,
  groupName,
  chatMessage
) {
  if (roomType === 1 && atMe === "true") {
    sendMessageGroup(groupName, receivedName, chatMessage);
  } else if (roomType === 2 || roomType === 4) {
    sendMessageUser(receivedName, chatMessage);
  } else if (roomType === 3 && atMe === "true") {
    sendMessageGroup(groupName, receivedName, chatMessage);
  }
}

module.exports = {
  getChatResponse,
  sendType,
  sendfile,
};
