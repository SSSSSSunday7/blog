---
title: Set集合
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# Set集合

> 是一种无序集合，不能有重复元素，添加元素不讲头尾，是无序的

##  1、添加元素

`SADD key member [member...]` 和列表一样，key代表集合名，如果key不存在则创建一个集合，值可以有一个或多个

会返回一个` 1`或` 0`表示成功和失败，如果添加重复的元素则会返回`0`

## 2、查找元素

 ### 2.1判断存在(SISMEMBER)

`SISMEMBER key member`判断元素是否在一个集合中

## 3、删除元素

`SREM key member [member...]`删除一个或多个元素

## 4、集合运算