---
title: SpringMVC入门
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- SpringMvc
categories: 
 - SpringMvc
---
# SpringMVC入门

> 简介：和servlet一样，是一种web层开发技术

## 依赖：

SpringMvc是基于servlet，所以需要加入servlet的依赖

## 配置：

### 配置Spring的配置类：

设置包扫描器，扫描对应mvc的类

![image-20231017192455630](/image-20231017192455630.png)

### 初始化Servlet容器

![image-20231017193009689](/image-20231017193009689.png)

## 第一个SpringMvc类

![image-20231017193324230](/image-20231017193324230.png)

### 流程分析

![image-20231017193607101](/image-20231017193607101.png)

### 避免和Spring加载的Bean冲突

![image-20231017193847917](/image-20231017193847917.png)

#### 排除所有带有@Controller的类

![image-20231017194328008](/image-20231017194328008.png)

还能按照正则过滤，把type改成`FilterType.REGEX`

![image-20231017194516951](/image-20231017194516951.png)

如果一个类有`@Configuration`那么它所加载的bean也会被加载,

![image-20231017194803911](/image-20231017194803911.png)

## 数组传参

> 参数是一个数组

![image-20231017195301461](/image-20231017195301461.png)

只需要用同一个参数名传递多个参数就好了

![image-20231017195316727](/image-20231017195316727.png)

## 集合传参

> 参数是一个集合

![image-20231017195602924](/image-20231017195602924.png)

加上`@RequestParam`注解，这样就可以像数组一样接收参数了

## JSON传参

> 先加jackson依赖，修改配置类，该注解十分强大，不止开启解析json一个功能
>
> ![image-20231017195926662](/image-20231017195926662.png)

### JSON数组传参

![image-20231017200032599](/image-20231017200032599.png)

直接加上`@RequestBody`

### JSON集合传参

![image-20231017200259735](/image-20231017200259735.png)

![image-20231017200318172](/image-20231017200318172.png)

## 日期类型传参

> 默认只支持斜线形式传输 xxxx/xx/xx

![image-20231017200500446](/image-20231017200500446.png)

> 可以通过`@DataTimeFormat(pattern="yyyy-MM-dd")`来指定格式

![image-20231017200618577](/image-20231017200618577.png)

还可以传,小时，分钟，秒

![image-20231017200902205](/image-20231017200902205.png)

![image-20231017200916396](/image-20231017200916396.png)



## 响应

在对应方法上写`@ResponseBody`就可以响应返回json了,不然只能响应字符串

通过jakson实现的，没有jackson依赖实现不了

在Springboot中可以使用在类中加`@RestController`直接让所有方法包含了`@Response`



