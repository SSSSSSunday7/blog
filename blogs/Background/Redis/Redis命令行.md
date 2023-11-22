---
title: Redis命令行
sidebar: 'auto' 
date: 2023-11-19
tags:
- redis
categories: 
 - redis
---
# Redis命令行

> 通过`redis-cli`命令进入连接数据库

` redis-server ` 启动redis

`redis-cli` redis命令行工具

`redis-cli -h {host} -p {port} -a {password} --raw #开启utf8编码`

-h 和 -p有默认值，如果是在本地以默认端口安装则没必要写