---
title: Hash表
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# Hash表

> hash是一个键值对的集合，适合用来存储对象

## 1、添加键值对

`HSET key field value [field value ...]`

与集合和列表一样， key是表名，如果存在就直接插入数据，如果不存在就创建并插入。

field是键，value是值。传入的是一个键值对。

## 2、查找键值对

`HGET key field`来根据键来获取值，或者直接使用`HGETALL key`来获取所有的键值对

`HKEYS key`可以查看某个hash表的所有键

`HLENS key`获取hash的长度

## 3、删除键值对

`HDEL key field`删除指定键值对

## 4、查看是否存在键值对

`HEXISTS key field`

