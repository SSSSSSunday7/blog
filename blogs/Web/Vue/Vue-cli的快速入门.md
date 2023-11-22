---
title: Vue-cli的快速入门
sidebar: 'auto' date: 2023-11-19
tags:
- vue 
- vue-cli
categories: 
 - Vue 
---
# Vue-cli的快速入门

## 1、安装

使用`yarn global add @vue-cli`或者`npm install @vue-cli -g`

如果报错

```
npm ERR! code EINVALIDTAGNAME
npm ERR! Invalid tag name "@vue-cli": Tags may not have any characters that encodeURIComponent encodes.
```

则把`@vue-cli`换成`@vue/cli`

进行全局安装，显示success就表示安装完成了

还可以通过vue -version查看版本来确认是否安装完成

### 1.1 出错

*无法将“vue”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。*

如果出现以上问题请将你的包管理器加入环境变量，比如我是yarn

那么在`环境变量Path`中直接添加全局bin文件夹解决`C:\Users\Sunday\AppData\Local\Yarn\Data\global\node_modules\.bin`

## 2、使用

在终端使用`vue create project-name`即可创建一个以项目名为project-name的项目目录

并且有已经配置完成的webpack和其它模块

### 2.1 目录文件详解

![image-20231012091335878](/image-20231012091335878.png)