---
title: ref和$refs
sidebar: 'auto' date: 2023-11-19
tags:
- vue
categories: 
 - Vue 
---
# ref和$refs

![image-20231012161254419](/image-20231012161254419.png)

为什么讲恰当时机，因为要等页面dom渲染完之后才能使用

# 1.获取组件

> 不只是能获取一般的dom节点，还能获取vue组件

`<BaseFrom ref="baseFrom"></BaseFrom>`

BaseFrom是一个vue组件，但是它仍然可以ref被获取，并且可以直接调用里面的定义的方法。

只要在父组件写一个事件，事件的方法调用`this.$refs.baseFrom.方法()`就可以调用子组件的方法