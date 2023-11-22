---
title: mybatis注解开发传参数
sidebar: 'auto' date: 2023-11-19
tags:
- java 
- mybatis 
categories: 
 - java
---
# mybatis注解开发传参数

## 1、顺序传值

```java
@Select("select * from  student where sname = #{param1} and sdept = #{param2}")
    List<Student> selectStudentInfo(String sname,String sdept);
```

## 2、@Param

在mapper方法参数上加上`@Param("参数名")`让该参数名和注解开发中的`#{参数名}`一致就行了

## 3、实体类传值

只要`#{参数名}`中参数名和实体类的属性字段名一致就可以传递参数，在xml中需要给该语句加上`parameterType="实体类的引用路径"`属性

## 4、Map传值法

只要`#{键名}`就可以拿到值了

## 5.默认传值

只要形参的名称和#{}内的名称相同也能成功传递