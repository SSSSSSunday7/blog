---
title: 发布订阅模式和Stream流
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
## 发布订阅模式和Stream流

> 可以创建一个频道，让每个订阅它的客户端都收到消息

 ## 1、发布和订阅

`PUBLISH channel message`  **发布消息**，

`SUBSCRIBE channel[channel ...]` **订阅频道**

channel是频道的名称

先发起订阅，**如果不存在频道则创建频道并订阅**

 发布订阅还有一些局限性，无法消息持久化，无法记录历史消息，可以通过Stream流来解决这些问题。

## 2、Stream流

> redis5.0当中引入的数据结构，是一个轻量级的消息队列，可以解决数据持久化问题

### 2.1 添加消息

`XADD key id field value [field value ...] `**星号代替id表示让redis自动生成消息id**，能传入任意个键值对

id格式 `整数-整数`第一个是时间戳，第二个是序列号，自己传入id要保证id是递增的

 #### 2.1.1 创建组

`XGROUP create 消息队列 组名称 id  `

创建一个消费者组

`XGROUP create 消息队列 组名称 id  `

`XINFO GROUPS 组名称 ` 获取组信息

添加消费者:

`XGROUP CREATECONSUMER 消息队列 组名 消费者名`

使用消费者读取消息:

`XREADGROUP GROUP 组名 消费者名  [COUNT count] BLOCK 3000 STREAM 消息队列名  `

### 2.2 查看流信息

`XLEN key` 查看消息队列长度

`XRANGE key strat stop [count]`查看消息队列具体信息 用`-`和`+`代替start和stop

#### 2.2.1 读取消息

`XREAD [COUNT count] `  例如 `XREAD key COUNT 2   `  表示读取两条消息

`XREAD [COUNT count] BLOCK 1000 STREAM 消息队列名 0   `   表示如果为空则**阻塞1000毫秒，也就是等待一秒**，期间收到消息就能获取到，

然后读取指定消息队列的消息,**0表示从0开始读取**，如果希望获取从现在以后的最新消息，可以换成$，建议设置堵塞事件长一点，因为接受消息是在堵塞时间内的新消息。

条数通过[COUNT count]控制

### 2.3 删除消息

`XDEL key id [id...  ]`通过id删除

`XTRIM key MAXLEN 0` 删除所有消息



 