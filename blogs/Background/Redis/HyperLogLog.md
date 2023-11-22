---
title: HyperLogLog
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# HyperLogLog

> HyperLogLog是一种用来做基数统计的算法，并不是redis独有的

## 用处

***基数的概念***：如果集合中每个元素都是唯一且不重复的，那么这个集合的基数就是集合中元素的个数，如果**一个集合有多个相同的数，也只算一个基数**

**HyperLogLog就是用来计算这个基数的**

## 原理

通过随机算法来计算技术，会有一定误差，但是占用内存小，适合精确度要求不高的情况，而且统计量非常大的工作。

比如统计某个网站的uv，统计某个词的搜索次数...

## 用法

命令都以PF开头

### 1、添加

`PFADD key 元素1 元素2 元素3...`

### 2、统计

`PFCOUNT key`

### 3、合并多个HyperLogLog

`PFMERGE 返回的集合 集合1 集合2 ...`