### 部署方案

#### **本地调试**

在根目录新建.env文件，参考.env.example新建相应的环境变量

运行

npm i

npm run start

#### **腾讯云函数（未实现）**

参考该链接部署

[快速部署 Express 框架 | 腾讯云 (tencentcloud.com)](https://www.tencentcloud.com/zh/document/product/583/41588)

备注：腾讯云函数不支持版本"axios": "^1.7.2",版本改为"axios": "^0.27.2"

## todo

- 修改前端页面，把获取环境变量从.env文件改成从系统获取。
- 给各运行节点设置日志记录
