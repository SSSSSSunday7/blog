---
title: String类型(第一课)
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# String类型(第一课)

## 1、String

redis是用键值对来存储数据的

默认数据类型就是String

这表示可以传各种类型的值(包括布尔类型)

## 2、set和get 

`set name sunday`就可以设置一个键值对

`get name`就可以获取一个键为`name`的键值对的值

> redis中的键是区分大小写的

`set name`和`set Name`是不一样的

## 3、del和exists

`del key`可以删除一个键值对

`exists key` 可以判断一个键是否存在

对于`del`命令和`exists`命令：

成功会返回`1`失败会返回`0`,代表`true`和`false`

## 3、查找和删除所有键（keys pattern、flushall）

通过keys命令来查看数据库中有哪些键

`keys pattern`  pattern参数是指pattern模式，比如`keys *`来查找所有键

还可以`keys *me`查找所有以me结尾的键



通过`flushall` 来删除所有键

## 4、过期时间

`TTL 键名`获取过期时间 输出`-1`表示没有设置过期时间,输出`-2`表示已经过期

通过`EXPIRE 键名 过期时间(单位秒)`来设置一个**已经存在的键**的过期时间

通过`SETEX key 过期时间 value`来设置一个带有过期时间的键值对

通过`SETEX key vlaue` 表示如果键不存在则设置一个值,如果键存在则不做任何动作
