---
title: 列表List
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# 列表List

> 一般用来存储一组有顺序的数据和数组比较类似

## 1、添加元素

`LPUSH key element [element...]`或`RPUSH key element [element...]`

来将一个或多个元素添加到列表的头部或尾部

key是列表List的名称，如果List不存在则直接创造列表

## 2、查找元素

`LRANGE key start stop` 来获取列表的值

key指列表名，start值起始位置，stop指结束位置，当起始位置是0，结束位置是-1时，表示从第一个到最后一个，也就是所有元素

## 3、删除元素

### 3.1 LPOP和RPOP

`LPOP key [count]`或`RPOP key [count]`表示从列表头部或尾部删除一个或多个元素

`LLEN key`可以获得列表长度

### 3.2 LTRIM

`LTRIM key start stop`

只保留start到stop之间的元素(包括start和stop)

## 4、用例

例如可以用`LPUSH`从头部添加元素，再用`RPOP`从尾部删除元素，这样就完成了先进后出队列