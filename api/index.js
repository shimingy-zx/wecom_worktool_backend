const express = require("express");
const app = express();

const indexRouter = require("../routes/index");
const worktoolRouter = require("../routes/worktool");
const envRouter = require("../routes/env");
const logsRouter = require("../routes/logs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 使用路由
app.use("/", indexRouter);
app.use("/worktool", worktoolRouter);
app.use("/", envRouter);
app.use("/", logsRouter);

// 启动服务器
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
