/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:33:14
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-29 02:08:28
 * @FilePath: /wecom_worktool_backend/services/chatService.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const axios = require("axios");

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
    return response.data.messages[0].content;
  } catch (error) {
    console.error("Error processing request:", error);
    throw error;
  }
}

// 向企业微信内外部群聊发送信息
async function sendMessageGroup(groupName, receivedName, chatMessage) {
  try {
    await axios.post(
      process.env.WORKTOOL_MES_URL,
      {
        socketType: 2,
        list: [
          {
            type: 203,
            titleList: [groupName],
            receivedContent: chatMessage,
            atList: [receivedName],
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
async function sendMessageUser(receivedName, chatMessage) {
  try {
    await axios.post(
      process.env.WORKTOOL_MES_URL,
      {
        socketType: 2,
        list: [
          {
            type: 203,
            titleList: [receivedName],
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
};
