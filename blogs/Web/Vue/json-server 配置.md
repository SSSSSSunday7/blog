---
title: json-server 配置
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- 调试工具
categories: 
 - Vue 
---
# json-server 配置

> 是一个模拟Restful API的服务器

node直接安装

使用`yarn global add json-server`全局安装

然后再终端目录下创建一个`db.json`

 官方实例：

```json
{
  "posts": [
    { "id": 1, "title": "json-server", "author": "typicode" }
  ],
  "comments": [
    { "id": 1, "body": "some comment", "postId": 1 }
  ],
  "profile": { "name": "typicode" }
}
```

然后`json-server --watch db.json`启动

然后通过Restful的方式请求就好了