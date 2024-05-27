### 部署方案

#### **本地调试**

在根目录新建.env文件，参考.env.example新建相应的环境变量

运行

npm i

npm run start

#### **腾讯云函数部署**

参考该链接部署

[快速部署 Express 框架 | 腾讯云 (tencentcloud.com)](https://www.tencentcloud.com/zh/document/product/583/41588)

[Serverless 应用中心 快速部署 Express 框架-框架支持-文档中心-腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/1154/43224)

云函数文件无法读取问题解决方案

[开发指引 / 基础能力 / 云函数 / 注意事项 (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/notice.html)

备注：腾讯云函数不支持版本"axios": "^1.7.2",版本改为"axios": "^0.27.2"

#### vercel部署(未配置)

[Using Express.js with Vercel](https://vercel.com/guides/using-express-with-vercel)

#### docker部署

git clone https://github.com/shimingy-zx/wecom_worktool_backend.git

在根目录新建.env文件，参考.env.example新建相应的环境变量

docker-compose up -d

or use Docker CLI : docker compose up -d


## todo

- 修改前端页面，把获取环境变量从.env文件改成从系统获取。
- 给各运行节点设置日志记录
