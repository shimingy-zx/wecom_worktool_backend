/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2024-05-31 02:46:33
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2024-06-01 10:12:55
 * @FilePath: /wecom_worktool_backend/routes/worktoolApp.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {});

router.get("/test", (req, res) => {
  return success;
});

router.get("/robot/robotInfo/get", (req, res) => {
  // console.log(req);

  res.send({
    code: 200,
    message: "操作成功",
    data: {
      robotId: "12",
      name: "陆教授助理",
      corporation: "陆向谦实验室",
      phone: "18184502522",
      sumInfo: "陆向谦实验室-陆教授助理-陆教授助理-添加工作签名…",
      openCallback: 1,
      encryptType: 0,
      createTime: "2023-06-02T16:40:13",
      callbackUrl: "http://54.153.32.221:3000/worktool",
      enableAdd: true,
      replyAll: 1,
      appidId: "mTeykVI",
      token: "oBtX2jxqmThT",
      enoodingAeskey: "SfkqfAc3Oof8tXkbpb",
      signature: "eyJhmLgsYdYtMqOA",
      signatureTime: 1689068546096,
      robotKeyCheck: 0,
      callBackRequestType: 2,
      userId: 1664552486337888256,
      robotType: 0,
      firstLogin: "2024-05-18T11:16:12",
      authExpir: "2025-05-18T11:16:12",
    },
  });
});

router.post("/robot/robotInfo/update", (req, res) => {
  console.log(req.body);
});

router.get("/appUpdate/checkUpdate", (req, res) => {
  res.send({
    code: 200,
    message: "操作成功",
    data: {
      id: 41,
      appName: "worktool",
      title: "v3.3.7更新啦~",
      updateLog:
        "1.首个付费版本！合作伙伴请微信获取！\\n2.安全升级！已重构所有模拟操作！\\n3.无法更新可从群公告手动下载！",
      versionName: "3.3.7",
      versionCode: 33071,
      minVersionCode: 31011,
      downloadUrl:
        "https://cdn.asrtts.cn/uploads/worktool/apk/worktool-3.3.7-release.apk",
      createTime: "2023-11-29T15:27:07.000+00:00",
      size: "7M",
      enable: true,
    },
  });
});

module.exports = router;
