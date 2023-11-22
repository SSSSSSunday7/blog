---
title: '@Bean的作用'
sidebar: 'auto' date: 2023-11-19
tags:
- Spring
categories: 
 - Spring
---
# @Bean的作用

> 如果你想将一个类给spring的IOC管理，那么，你只需要在这个类上面加上@Component注解就行了

但是如果你要将外部的jar包的类给spring管理，如果你还去改jar包的源代码，那么就会很麻烦

那么你就可以在带有@Configuration的类里写一个工厂方法，返回一个对象

具体怎么返回看你需求

然后在上面加上@Bean注解

```java
@Configuration
public class UserConfig {
    @Bean
    public User getUser(){
        return new User();
    }
}

```

