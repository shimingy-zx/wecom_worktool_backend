/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-25 20:33:14
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-26 02:09:03
 * @FilePath: /wecom_worktool_backend/services/chatService.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const axios = require("axios");

async function getChatResponse(spoken) {
  try {
    const response = await axios.post(
      process.env.COZE_ROBOT_ID,
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

async function sendWorktoolMessage(receivedName, chatMessage) {
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

function sendWorktoolMessageBasedOnRoomType(
  roomType,
  atMe,
  receivedName,
  groupRemark,
  chatMessage
) {
  if (roomType === 1 && atMe === "true") {
    sendWorktoolMessage(groupRemark, chatMessage);
  } else if (roomType === 2 || roomType === 4) {
    sendWorktoolMessage(receivedName, chatMessage);
  } else if (roomType === 3 && atMe === "true") {
    sendWorktoolMessage(groupRemark, chatMessage);
  }
}

module.exports = {
  getChatResponse,
  sendWorktoolMessageBasedOnRoomType,
};
