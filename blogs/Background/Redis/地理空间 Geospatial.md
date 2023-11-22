---
title: 地理空间 Geospatial
sidebar: 'auto' date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# 地理空间 Geospatial

> redis3.2新增的特性，支持存储地理位置信息，支持对地理位置进行各种计算操作

相关的命令都以GEO开头

## 1、新增地理位置

`GEOADD key 经度 纬度 城市名 ` 

key表示这个地理信息的名字,可以添加多个城市

## 2、获取具体信息

GEOPOS(position)`GEOPOS key 城市名`返回一个数组，第一个表示经度，第二个表示纬度

## 3、计算两个地理位置的距离

例：

计算北京和上海的距离：

`GEODIST key beijing shanghai`

`GEODIST key beijing shanghai KM`返回千米为单位的距离

## 4、搜索指定物理距离内的城市

`GEOSEARCH key FROMMEMBER 指定的城市或经纬度 BYRADIUS(圆形)|BYBOX(矩形)  距离(300KM)`