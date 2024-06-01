/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-29 17:14:37
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-05-31 17:58:59
 * @FilePath: /wecom_worktool_backend/services/wsHandler.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// wsHandler.js

const WebSocket = require("ws");
const log = require("../config/logger"); // 导入logger模块

let clients = [];

const message = {
  apiSend: 0,
  list: [
    {
      msgSource: 0,
      textType: 0,
      type: 202,
    },
  ],
  messageId: "1795714266236407808",
  socketType: 2,
};

module.exports = (ws) => {
  console.log("客户端已连接");

  // 保存客户端连接
  // clients.push(ws);

  ws.send(
    JSON.stringify({
      apiSend: 0,
      list: [
        {
          msgSource: 0,
          textType: 0,
          type: 202,
        },
      ],
      messageId: "1795714266236407808",
      socketType: 2,
    })
  );

  // 处理收到的消息
  ws.on("message", (message) => {
    const messageString = message.toString(); // 将Buffer对象转换为字符串
    console.log("收到消息:", messageString);
    log.info(messageString);
    // 发送回复
    ws.send(
      JSON.stringify({
        apiSend: 0,
        list: [
          {
            msgSource: 0,
            textType: 0,
            type: 202,
          },
        ],
        messageId: "1795714266236407808",
        socketType: 2,
      })
    );
  });

  // 处理连接关闭
  ws.on("close", () => {
    console.log("客户端已断开连接");
    // 移除断开的客户端
    clients = clients.filter((client) => client !== ws);
  });
};

// // 每隔 5 秒向所有客户端发送一条消息
// setInterval(() => {
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       const message = {
//         apiSend: 0,
//         list: [
//           {
//             msgSource: 0,
//             textType: 0,
//             type: 202,
//           },
//         ],
//         messageId: "1795714266236407808",
//         socketType: 2,
//       };
//       client.send(JSON.stringify(message)); // 将对象转换为JSON字符串
//     }
//   });
// }, 1000);
