---
title: Vuex入门
sidebar: 'auto' date: 2023-11-19
tags:
- vue
categories: 
 - Vue
---
# watch

> 监视数据变化，执行一些业务逻辑或异步操作，和v-model最大的区别就是

## 1、简单写法

> 监视简单类型的数据，直接监视

语法：

直接用数据名作为方法名写在watch里

![image-20231103153938563](/watch属性/image-20231103153938563.png)

**对象写法**

![image-20231103155245591](/watch属性/image-20231103155245591.png)

## 2、完整写法

![image-20231103160341050](/watch属性/image-20231103160341050.png)

> deep可以直接在watch里使用对象的所有属性

![image-20231103160641972](/watch属性/image-20231103160641972.png)

### 解决页面初始化不会调用watch的问题(immediate)

> 加上该属性可以在页面加载时立刻执行一次