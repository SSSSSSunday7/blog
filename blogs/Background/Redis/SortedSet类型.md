---
title: SortedSet类型(有序集合)
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# SortedSet类型(有序集合)

> 是一个可排序的set集合,又称为ZSET，和java中的TreeSet类似，但是底层不一样，SortedSet的每一个元素都有一个score属性,可以基于score属性对元素进行排序，底层的实现是一个跳表（SkipList）加hash表

特性：

+ 可排序
+ 元素不重复
+ 查询速度快

因为可排序性经常用来做排行榜



常见命令：

![image-20231020111020370](/image-20231020111020370.png)

`Z`改成`ZREV`可以反转查询，默认是以score从小到大排序，可以改为从大到小