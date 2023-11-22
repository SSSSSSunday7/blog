---
title: JDBC连接Mysql设置时区
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- JDBC 
- Mysql
categories: 
 - java
---
# JDBC连接Mysql设置时区

## 为什么要设置时区

MySQL数据库中存储的时间戳数据是以UTC时间存储的，而在实际应用中，我们需要将这些时间戳数据转换成本地时间。如果不正确地设置时区，就会导致时间戳数据转换错误。

## 如何设置时区

设置时区时，在url中添加`serverTimezone`参数，比如`serverTimezone=GMT%2B8`（URL 中 %2B表示+号，GMT%2B8即为GMT+8）。

**例如** 

```yaml
jdbc:mysql:///springDemo01?useSSL=false&serverTimezone=GMT%2B8
```

 