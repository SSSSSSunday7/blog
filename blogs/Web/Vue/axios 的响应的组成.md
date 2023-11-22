---
title: axios 的响应的组成
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- axios
categories: 
 - Vue 
---
# axios 的响应的组成

![image-20231013092918423](/image-20231013092918423.png)

如图，是发送了一个post请求所回调的response，由以下几个部分组成：

+ config
  + 包含了**请求类型(method)**，**请求头(headers)**, **请求路径(url)**等

+ data
  + 包含了**响应体**，服务器**返回的json会被axios自动解析成js对象**，方便修改。

+ headers
  + 包含了**响应头**的信息

+ request
  + 包含原生**ajax对象**

+ status
  + 响应状态码

+ statusText
  + 响应状态字符串